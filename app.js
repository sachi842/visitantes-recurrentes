const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 3000;

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on('error', (e) => console.log(e));
mongoose.connection.once('open', () => console.log('Mongoose Connected'));
const dataSchema = mongoose.Schema({
    name: {
        type : String,
        default: "Anónimo",
    },
    count: {
        type: Number,
        default: 1
    }
});

const VisitorModel = mongoose.model('Visitor', dataSchema);

app.get('/', async (request, response) => {
    
    if(request.query.name){
        await VisitorModel.findOne({name:request.query.name }, async (error, result) => {
            console.log(result)
            
            if(result){
                result.count+= 1
                result.save((error) => {
                    if (error){
                        console.log(error);
                        return
                    }
                    console.log('Document Updated');
                });
            }else{
                const firstData = new VisitorModel({
                    name: request.query.name
                });

                await firstData.save((error) => {
                    if (error){
                        console.log(error);
                        return
                    }
                    console.log('Document created');
                });
            }
        })

    }else{
        
        const firstData = new VisitorModel({});

        await firstData.save((error) => {
            if (error){
                console.log(error);
                return
            }
            console.log('Document created');
        });

    }

    

    VisitorModel.find().exec((error, elements) =>{

        let trString = "";

        console.log(`elements ${elements}`)
        
        elements.map( (value) =>{
            trString += `
                <tr>
                    <td>${value._id}</td>
                    <td>${value.name}</td>
                    <td>${value.count}</td>
                </tr>
            `
            console.log("este es tr string " +trString)
            
        })

        response.send(`
        <table>
            <thead>
                <th>ID</th>
                <th>Name</th>
                <th>Visits</th>
            </thead>
            <tbody>
                ${trString}
            </tbody>
        </table>
    `);       
    })
    
     
});

app.listen(port, () => console.log(`Listening on port ${port}`));