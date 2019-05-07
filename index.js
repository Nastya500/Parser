const osmosis = require( "osmosis" ), fs = require( "fs" ),

        MongoClient = require( "mongodb" ).MongoClient,
        url = "mongodb://localhost:27017/",
        mongoClient = new MongoClient( url, { useNewUrlParser: true });         // create host connection

var json = {}, element = {}, i = 0;

osmosis
    .get( "https://akcenter.com.ua/ru/kanctovari/bloknoti/" )                          // request to http(s)://...
    .find( ".product" )                                                      // find needed class
    .set({
        name: ".stock",
        
        price_old: ".number"                        // create needed item via classes
                    
    })
    .data(( data ) => {                                                         // work with on data
        json[ "Canc_" + i ] = { name: data.name,
                                   price_old: data.price_old }; i++;
    })
    .done( () => {
        fs.writeFileSync( "index.html", JSON.stringify( json ), ( err ) => {     // write data to needed file
            if ( err ) throw err;                             
        });

        mongoClient.connect(( err, client ) => {                                // write data to mongodb
            if ( err ) { throw err } 
            else {
                const db = client.db( "Shop" );
                const collection = db.collection( "Other" );
                collection.insertOne( json, function( err, result ) {
                    if ( err ) throw err;
                    client.close();
                });
            }
        });
    });