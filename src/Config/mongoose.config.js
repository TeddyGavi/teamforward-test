const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose
	.connect(
		// `mongodb+srv://new-user-22:${KEY}@cluster0.4qha5k5.mongodb.net/?retryWrites=true&w=majority`, <- V43 MongoDB Cluster
		`mongodb+srv://teamforward:${encodeURIComponent(
			process.env.MONGODB_PW
		)}@teamforward.i663tys.mongodb.net/?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useFindAndModify:false
		}
	)
	.then(() => console.log('Successfully connected to MongoDB'))
	.catch((err) => console.log(err));
