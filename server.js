const app = require("./app");
require("./db/mongoose");
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
