const app = require("./server");

const PORT = process.env.PORT || 9090; // Use a PORT from environment or default to 9090

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
