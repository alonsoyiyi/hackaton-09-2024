const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, disconnectDB } = require("./db");
const User = require("./models/User")

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conectar a la base de datos al iniciar la app
connectDB();

app.post("/user", async (request, response) => {
	// TODO: Si el correo no existe, crear un nuevo usuario en la DB (Mongo) y devolver el ID.
	// TODO: Si existe solamente devolver el ID
	// TODO: Redireccionar al frontend con el token en la URL (no es lo más seguro, pero es un ejemplo)

	const { email, phone, fullname } = request.body;
	if (!email) {
		return response.status(400).json({ message: "Debes poner tu correo de forma obligatoria" });
	}
	try {
		let user = await User.findOne({ email });
		if (!user) {
			user = new User({ email, phone, fullname });
			await user.save();
		}

		// response.redirect("http://localhost:5500/auth?id=");
		response.redirect(`http://localhost:5500/auth?id=${user._id}`);


	} catch (error) {
		console.error(error);
		response.status(500).json({ message: "Error al crear el usuario" });
	}

});

app.post("/skill", async (request, response) => {
	// TODO: Agregar una habilidad a tu propio usuario en la DB (Mongo)
	const { email, skill } = request.body;
	if (!email || !skill) {
		return response.status(400).json({ message: "Email y habilidad son requeridos." });
	}
	try {
		const user = await User.findOne({ email });
		if (!user) return response.status(404).json({ message: "usuario no encontrado" });

		user.skills.push(skill);
		await user.save();
		response.json({ message: "Nuevo skill agregado.", skills: user.skills });
	} catch (error) {
		console.error(error);
		response.status(500).json({ message: "Error al agregar la habilidad" });
	}

});

app.get("/user", async (request, response) => {
	// TODO: Obtener tu información de usuario (incluyendo skills) de la DB (Mongo)
	const { email } = request.query;

	if (!email) {
		return response.status(400).json({ message: "Email es requerido." });
	}
	try {
		const user = await User.findOne({ email }).populate("skills");
		if (!user) return response.status(404).json({ message: "Usuario no encontrado." });
		response.json({ data: user, message: "Este es tu usuario." });
	} catch (error) {
		console.error(error);
		response.status(500).json({ message: "Error al obtener el usuario" });
	}
});

app.get("/users", async (request, response) => {
	// TODO: Obtener la información de todos los usuarios (incluyendo skills) de la DB (Mongo)
	try {
		const users = await User.find().populate("skills");
		response.json({ data: users, message: "Usuarios y skills." });
	} catch (error) {
		console.error(error);
		response.status(500).json({ message: "Error al cargar usuarios" });
	}

});

app.listen(PORT, () => console.log("Listening on PORT", PORT));

// Desconectar cuando la app se cierre (por ejemplo, en casos de interrupción)
process.on("SIGINT", async () => {
	await disconnectDB();
	process.exit(0);
});
