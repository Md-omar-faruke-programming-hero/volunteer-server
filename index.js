const express =require('express')
require('dotenv').config()
const ObjectId= require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
const cors=require('cors')
const app= express()
const port= process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("server connected")
})
app.listen(port,()=>{
    console.log("listening port",port)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqb98.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
         try{
             
            await client.connect();

            const database= client.db("volunteer");
            const dataCollection=database.collection("data")
            const volunteerCollection=database.collection("user")
            
            // get api
            app.get("/data",async(req,res)=>{
            const cursor= dataCollection.find({})
            const result= await cursor.toArray()
            res.send(result)
            })

            // post api
            app.post("/data",async(req,res)=>{
                console.log(req.body.name);
                const doc={
                    name:req.body.name,
                    description:req.body.description,
                    date:req.body.date,
                    img:req.body.img
                }
                const result= await dataCollection.insertOne(doc)
                res.json(result)
                console.log(result);
            })

            // get api for volunteer
            app.get("/volunteer",async(req,res)=>{
                const cursor= volunteerCollection.find({})
                const result= await cursor.toArray()
                res.send(result)
            })
            // get api for volunteer single
            app.get("/volunteer/:id",async(req,res)=>{
                const id=req.params.id
                const query= {_id:ObjectId(id)}
                const cursor=volunteerCollection.find(query)
                const result=await cursor.toArray()
                res.send(result)
            })

            // delete api
            app.delete("/volunteer/:id",async(req,res)=>{
                const id=req.params.id
                const query= {_id:ObjectId(id)}
                const result= await volunteerCollection.deleteOne(query)
                res.json(result)
                console.log(result)
            })


            // post api for volunteer
            app.post("/volunteer",async(req,res)=>{
               const name=req.body.name
               const email=req.body.email;
               const description=req.body.description
               const date=req.body.date;
               const activity=req.body.activity;

               const doc={
                   name:name,email:email,description:description,data:date,activity:activity
               }

               const result= await volunteerCollection.insertOne(doc)
               res.json(result)
               console.log(result)
            })

         }
         finally{

         }
}
run().catch(console.dir)