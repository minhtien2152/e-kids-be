const app = require("./app");

const connectDB = require("./utils/connectDB");

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
