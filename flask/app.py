# Load libraries
import flask

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from pathlib import PurePath
from pydub import AudioSegment
from jiwer import wer
import os

word_dict = pd.read_excel("ox-api.xlsx")

# instantiate flask 
app = flask.Flask(__name__)

def CTCLoss(y_true, y_pred):
    # Compute the training-time loss value
    batch_len = tf.cast(tf.shape(y_true)[0], dtype="int64")
    input_length = tf.cast(tf.shape(y_pred)[1], dtype="int64")
    label_length = tf.cast(tf.shape(y_true)[1], dtype="int64")

    input_length = input_length * tf.ones(shape=(batch_len, 1), dtype="int64")
    label_length = label_length * tf.ones(shape=(batch_len, 1), dtype="int64")

    loss = keras.backend.ctc_batch_cost(y_true, y_pred, input_length, label_length)
    return loss

characters = [x for x in "abcdefghijklmnopqrstuvwxyz "]
# Mapping characters to integers
char_to_num = keras.layers.StringLookup(vocabulary=characters, oov_token="")
# Mapping integers back to original characters
num_to_char = keras.layers.StringLookup(
    vocabulary=char_to_num.get_vocabulary(), oov_token="", invert=True
)
# An integer scalar Tensor. The window length in samples.
frame_length = 256
# An integer scalar Tensor. The number of samples to step.
frame_step = 160
# An integer scalar Tensor. The size of the FFT to apply.
# If not provided, uses the smallest power of 2 enclosing frame_length.
fft_length = 384

def encode_testdata(wav_file, label):
    ###########################################
    ##  Process the Audio
    ##########################################
    # 1. Read wav file
    file = tf.io.read_file(wav_file)
    # 2. Decode the wav file
    audio, _ = tf.audio.decode_wav(file)
    #print(sample_rate)
    #reduced_noise = nr.reduce_noise(y=audio, sr=44100)
    audio = tf.squeeze(audio, axis=-1)
    # 3. Change type to float
    audio = tf.cast(audio, tf.float32)
    # 4. Get the spectrogram
    spectrogram = tf.signal.stft(
        audio, frame_length=frame_length, frame_step=frame_step, fft_length=fft_length
    )
    # 5. We only need the magnitude, which can be derived by applying tf.abs
    spectrogram = tf.abs(spectrogram)
    spectrogram = tf.math.pow(spectrogram, 0.5)
    # 6. normalisation
    means = tf.math.reduce_mean(spectrogram, 1, keepdims=True)
    stddevs = tf.math.reduce_std(spectrogram, 1, keepdims=True)
    spectrogram = (spectrogram - means) / (stddevs + 1e-10)
    ###########################################
    ##  Process the label
    ##########################################
    # 7. Convert label to Lower case
    label = tf.strings.lower(label)
    # 8. Split the label
    label = tf.strings.unicode_split(label, input_encoding="UTF-8")
    # 9. Map the characters in label to numbers
    label = char_to_num(label)
    # 10. Return a dict as our model is expecting two inputs
    return spectrogram, label

def decode_batch_predictions(pred):
    input_len = np.ones(pred.shape[0]) * pred.shape[1]
    # Use greedy search. For complex tasks, you can use beam search
    results = keras.backend.ctc_decode(pred, input_length=input_len, greedy=True)[0][0]
    # Iterate over the results and get back the text
    output_text = []
    for result in results:
        result = tf.strings.reduce_join(num_to_char(result)).numpy().decode("utf-8")
        output_text.append(result)
    return output_text

# Recreate the exact same model, including its weights and the optimizer
model = tf.keras.models.load_model('finalModel.h5',custom_objects={'CTCLoss':CTCLoss},compile=False)
# Optimizer
opt = keras.optimizers.Adam(learning_rate=1e-4)
# Compile the model and return
model.compile(optimizer=opt, loss=CTCLoss)

# define a predict function as an endpoint 
@app.route("/predict", methods=["GET","POST"])
def predict():
    
    data = {"success": False}
    if flask.request.method == 'POST':
        params = flask.request.json
        if (params == None):
            params = flask.request.args

        # if parameters are found, return a prediction
        if (params != None):
            if 'file' not in flask.request.files:
                flask.flash('No file part')
                return flask.redirect(flask.request.url)
            
            word =flask.request.form.get("word")
            word = word.lower()
            correct_pronun=word_dict[word_dict['word']==word].iloc[:,[1]].to_numpy()[0][0].lower()
            
            file = flask.request.files['file']
            print(file.content_type)
            final_name =file.filename.split(".")[0] + ".wav"
            flac_tmp_audio_data = AudioSegment.from_file(file, format="m4a")
            flac_tmp_audio_data.export(final_name, format="wav", parameters=['-acodec', 'pcm_s16le', '-ac', '1', '-ar', '44100'])
            test_data = encode_testdata(final_name,'take')
            X,y = test_data
            matrix = X[np.newaxis,...]
            batch_predictions = model.predict(matrix)
            batch_predictions = decode_batch_predictions(batch_predictions)
            print(batch_predictions)
            print([correct_pronun])
            wer_score = wer([correct_pronun],batch_predictions )
            data["target"] = str(correct_pronun)
            data["prediction"] = str(batch_predictions[0])
            data["score"] = str(1-wer_score)
            #os.remove(final_name)
            data["success"] = True

    # return a response in json format 
    return flask.jsonify(data)    

# start the flask app, allow remote connections 
app.run(host='0.0.0.0')