
//Challenge Read File 
////////////////////////

try {
 
        let element = document.createElement('input');
        element.setAttribute('type', "file");
        element.setAttribute('id', "btnOpenFile");
        element.onchange = function(){
            readText(this, event);
            }
               
            /** hide the input button */
            /* nascondo il bottone sfoglia */
            element.style.display = 'block';
            element.style.marginLeft = '10px';
            document.body.appendChild(element);
           
            let table = document.querySelector("table");
            table.before(element);
           
            /** "element" è il bottone per sfogliare i file  */
            /** "element" is the button to search the file  */
            element.click();

          
    function readText(filePath) {    
            let reader;
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                  reader = new FileReader();
            } else {
                  alert('FileReader not supported in your browser');
                  return false;
            }
            let output = ""; 
            let fileWeaDat = (filePath.files[0].name === "weather.dat") ? true : false;
            
            if(filePath.files && filePath.files[0] && fileWeaDat) {  
                //console.log("filePath.files.length "+filePath.files.length===0);
                console.log(filePath.files[0].name);
                
                  reader.onload = function (e) {
                      output = e.target.result;
                      parseResult(output);
                  };//end onload()
          
                  reader.readAsText(filePath.files[0]);
                  //reader.onerror = errorHandler;
            }//end if 
            else { 
                  errorHandler();
                  return false;
            }       
              return true;
    }

    let errorHandler = ()=>alert('Cannot read this file!\n\rPlease, choose the weather.dat file!');  
          
          
    function parseResult(result) {
        /** "?" is the quantifier: between zero and once, as many times as possible */
        /* "?"  è il quantificatore: tra zero e una volta, il maggior numero di volte possibile */
        let lines = result.split(/\r?\n/g); 
              
        /** table head  */
        /** la head della tabella */
        let headers = [];
        let datArray = [];
          
            /** the loop starts from 2 because the file data start from the third line */
            /** il ciclo parte da 2 perchè i dati del file cominciano dal terzo rigo */
            for (var i = 2; i < lines.length; i++) { 
             
                /** I create an object in which the keys are made up
                * from my table head and the values are the corresponding ones
                * to each column
                */
                /** creo l'oggetto in cui le chiavi sono costituite 
                * dall mia head e i valori sono quelli corrispondenti 
                * a ciascuna colonna 
                */
                let dataObj = {};
                  
                let primoIndice = 0;
                let ultimoIndice = 0;
          
                // I Loop over strings of my table head to make single words 
                // Ciclo sulle stringhe per formare le singole parole della mia head 
                headers=lines[0].split(' ').filter(el=>(el != '' ));
                headers.forEach(function (header) {
                        ultimoIndice = (lines[0].lastIndexOf(header))+header.length;
                  
                        /** Now I have to make the substrings, that is my header words
                        * to which the values of the respective columns correspond * /
                        /** dataObj[header] is the key to my Obj */
          
                        /** adesso devo formare le sotto stringhe cioè le mie parole della header 
                        * a cui corrispondono i valori delle rispettive colonne */
                        /** dataObj[header] è la chiave le mio oggetto */
                        dataObj[header] = lines[i].substr(primoIndice, (ultimoIndice-primoIndice));
          
                        /** to remove the asterisk from the numbers */
                        /** per togliere l'asterisco dai numeri  */
                        dataObj[header]=dataObj[header].replace('*','');
                        primoIndice = ultimoIndice;
                              //console.log("dataObj[header] "+dataObj[header]);
                }); 
                      
            /* I calculate the temperature range inside a temporarily added field * /
            / ** I cast them because they are strings */
            /* Calcolo l'escursione termica dentro ad un campo aggiunto temporaneamente*/
            /** Faccio il cast perchè sono stringhe */
            dataObj["Range"] = Number(dataObj["MxT"])-Number(dataObj["MnT"]);
          
            /* if not a number, replace with 0 */
            /* se non è un numero, sostituisci con 0 */
            dataObj["Range"] = Number.isNaN(dataObj["Range"])? 0 : dataObj["Range"];
                          
            /** to remove the text "mo" from column Dy * /
            /** per eliminare il testo "mo" dalla colonna Dy */
            dataObj["Dy"] = Number(dataObj["Dy"]) ? dataObj["Dy"]: 0;          
          
            /** I make the array of objects
            *   removing all data less than 0 */
          
            /** creo l'array di oggetti */
            /** Tolgo tutti i dati minori di 0 */
            if(dataObj["Range"]>0){datArray.push(dataObj);};
                         
            };
           
                          
        /* I sort data from the smallest temperature range */         
        /* ordino i dati dall'escursione termica più piccola */
              
        datArray.sort( (a,b ) =>{
                return a["Range"] - b["Range"];  
                });
        
        console.log("day with minimum range: "+datArray[0]["Dy"]); // output 14 (day with minimum range)(giorno col minimo range ) 
        console.log("day with maximum range: "+datArray[datArray.length-1]["Dy"]); // output 9 (day with maximum range)(giorno col massimo range )
          
                  
        //let table = document.querySelector("table");
          
        let dataheaders = Object.keys(datArray[0]);
        //console.log("dataheaders "+dataheaders);
          
        generateTableHead(table, dataheaders);
        generateTableBody(table, datArray);
        
    }


    /** loading the table and clicking on the "Dy" or
      * on the first box immediately below,
      * you can read the result of the output
      */
    /** al caricamento della tabella e cliccando sulla casella "Dy" o 
     *  sulla prima casella immediatamente sotto 
     *  si può leggere il risultato dell'output
     */
    window.onload = function () {
        document.querySelector('table').onclick = function(evt) {
          let rowIndex = evt.target.parentElement.rowIndex;
          let cellIndex = evt.target.cellIndex;
            if(rowIndex == 1 && cellIndex == 0 || rowIndex == 0) {
                alert('The 14th day is the one with the\n\rminimum temperature range.\n\rThis is 2.');
            }
        //alert('Row = ' + rowIndex + ', Column = ' + cellIndex);

        }
    }
          
    /** I create the table header  */
    /** genero la header della tabella  */
    function generateTableHead(table, data) {
        table.border = "1";
        let thead = table.createTHead();
        let row = thead.insertRow();
            for (let key of data) {
                let th = document.createElement("th");
                let text = document.createTextNode(key);
                th.appendChild(text);
                row.appendChild(th);
            }
    }
          
    /** I create the body of the table with cells */
    /** generare il body della tabella con le celle */
    function generateTableBody(table, data) {
        table.border = '1';
            for (let element of data) {
                let row = table.insertRow();
               
                for (key in element) {
                   let cell = row.insertCell();
                   let text = document.createTextNode(element[key]);
                   cell.appendChild(text);
                  
                }
                
            }
        document.querySelector('.output').innerHTML = "If you click on the \"Dy\" box or on the first box immediately below, you can read the result of the output";
    }
    
} catch (error) {
    console.log(error);
    document.getElementById("errorMessage").innerHTML = error.message;
}

