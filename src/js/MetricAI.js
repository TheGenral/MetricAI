/*
I'm looking to establish KPIs for my business. We operate in the [Your Industry] industry, 
serving the [Your Customer Segment] customer segment. Can you provide me with a set of KPIs
that are crucial for our success in this industry and with this customer segment, along with
the benchmarks we should aim to achieve for each KPI? Additionally, if you have any relevant
resources or references that provide industry benchmarks for these KPIs, please share those as well.
I'm looking for information that can help us understand the performance standards in our industry and make
informed decisions.
*/
window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;
let readystatus = []
const boxupload = document.getElementById('boxupload');
const uploadimgbtn = document.getElementById('uploadimgbtn');
const uploadstage = document.getElementById('uploadstage');
const choseStage = document.getElementById('choseStage');
const fineshStage = document.getElementById('fineshStage');
const boxmetricAI = document.getElementsByClassName('boxmetricAI')[0]
let jsondata, excelfile;
function checkfile(sender) {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
        alert("Invalid file selected, valid files are of " +
            validExts.toString() + " types.");
        return false;
    }
    else {
        let files = uploadimgbtn.files;

        var filename = files[0].name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
        if (extension == '.XLS' || extension == '.XLSX') {
            uploadstage.style.display = "none";
            choseStage.style.display = "block";
            ChangeExcel2Json(files[0]);
        } else {
            alert("Please select a valid excel file.");
        }

        return true
    };
}
new Typewriter('#LogoTypeing', {
    strings: ['MetricAI'],
    autoStart: true,
    loop: true,
    pauseFor: 2000

});
const API_KEY = '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'
let syncmessages = []
async function startwork() {


    let orgData = document.querySelectorAll(".field>*");
    if (jsondata != null && orgData[0].value != '' && orgData[2].selectedIndex != 0 && orgData[3].selectedIndex != 0) {
        document.querySelector('.boxmetricAI>.row').style.display = "none";
        boxmetricAI.style.backgroundImage = `url('Assets/ExportStage.svg')`;

        document.querySelector("#finshed").style.display = "block";
        let detail = [{
            "role": "system", "content": `I'm looking to establish KPIs for my business. We operate in the ${orgData[2].value} industry, serving the ${orgData[3].value} customer segment. Can you provide me with a set of KPIs that are crucial for our success in this industry and with this customer segment, along with the benchmarks we should aim to achieve for each KPI? Additionally, if you have any relevant resources or references that provide industry benchmarks for these KPIs, please share those as well. I'm looking for information that can help us understand the performance standards in our industry and make informed decisions`
        }, {
            "role": "user", "content": "my Dataset :" + JSON.parse(jsondata)
        }, {
            "role": "user", "content": `I WANT THE ANSWER json format and to be like this 
            
            KPI Name 
            Explanation
            Benchmark
            Resource
                 
            AT THE END MENTION YOU REFRENCE FOR THE BENCHMARKS
            MAKE THE REPLAY IN JSON FORMAT AND GIVE ME MORE THAN 10 KPIs
            `
        }]
        let senddata;
        if (syncmessages.length > 0) {

            senddata = syncmessages

        } else {
            syncmessages[0] = detail[0]
            syncmessages[1] = detail[1]
            senddata = detail
        }
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo-16k",
                messages: senddata,
                temperature: 0.7
            })
        })
        let data = await response.json()
        console.log(data)
        syncmessages.push(data.choices[0].message)
        let last = syncmessages.length
        try {
            let json = JSON.parse(data.choices[0].message.content)
            pdfexporter(json);
        } catch (error) {
            syncmessages.push({
                "role": "user", "content": `I WANT THE ANSWER json format and to be like this 
                
                KPI Name 
                Explanation
                Benchmark
                Resource
                 
            AT THE END MENTION YOU REFRENCE FOR THE BENCHMARKS
            MAKE THE REPLAY IN JSON FORMAT AND GIVE ME MORE THAN 10 KPIs` })
            startwork()
        }



    }
}
let el;

function pdfexporter(data) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'px', 'a4');
        let Counter = Object.keys(data.KPIs).length;
        el = `<div class="mt-5">`
        for (let index = 0; index < Counter; index++) {
            let KPINAME = data.KPIs[index]['KPI Name'];
            let KPIDesc = data.KPIs[index]['Explanation']
            let KPIBenchmark = data.KPIs[index]['Benchmark'];
            let KPIResource = data.KPIs[index]['Resource'];
            el += `<div style="width:1024px">
        <h1 style="font-size:24px; word-wrap: break-word; line-height: normal;" >${index + 1}-<b>${KPINAME}:</b> ${KPIDesc}</h1>
        <h2 style="font-size:20px; word-wrap: break-word; line-height: normal;" >${KPIBenchmark}</h2>
        <h3 style="font-size:16px; word-wrap: break-word; line-height: normal;" > ${KPIResource}</h3>
    </div>`


        }
        el += `</div>`
        let elementHTML = document.createElement('div');
        elementHTML.style.display = 'block'
        elementHTML.setAttribute("id", "elementHtml")
        document.getElementsByTagName('body')[0].appendChild(elementHTML)
        el = el.replace('undefined', "")
        elementHTML.innerHTML = el;
        elementHTML = document.getElementById('elementHtml')
        doc.addImage('http://127.0.0.1:5500/Website/Assets/Logo.png', 'PNG', 30, 10, 90, 30)

        doc.html(elementHTML, {
            callback: function (doc) {
                // Save the PDF
                doc.save('sample-document.pdf');
                elementHTML.removeAttribute("style");

            },
            x: 30,
            y: 50,
            width: 700,
            windowWidth: elementHTML.offsetWidth


        });
    } catch (error) {
        console.log(error)
        syncmessages.push({
            "role": "user", "content": `I WANT THE ANSWER json format and to be like this 
            
            KPI Name 
            Explanation
            Benchmark
            Resource
             
        AT THE END MENTION YOU REFRENCE FOR THE BENCHMARKS
        MAKE THE REPLAY IN JSON FORMAT AND GIVE ME MORE THAN 10 KPIs` })
        startwork()
    }

}

async function ChangeExcel2Json(file) {
    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = async function (e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            var result = {};
            /* workbook.SheetNames.forEach(function (sheetName) {
                 var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                 if (roa.length > 0) {
                     result[sheetName] = roa;
                 }
             });*/
            let row = document.querySelector('#choseStage>.row')
            workbook.SheetNames.forEach(async function (sheetName) {

                row.insertAdjacentHTML('beforeend', `<div class="col-12 col-md-4"><button onclick="sheet2json(this)" class="sheetchoice" >${sheetName}</button></div>`);
                console.log(sheetName)

                setTimeout(() => {

                }, 2000);

            })
            let x = false
            let chosesheet = document.querySelectorAll('.sheetchoice')

            excelfile = workbook

        }


    }
    catch (e) {
        console.error(e);
    }
}

function ContainChecker(el, name) {
    for (let index = 0; index < el.length; index++) {
        let x = el[index].classList.contains(name)
        if (x == true) {
            return true
        } else {
            return false
        }

    }

}

function sheet2json(el) {
    let result = {}
    let status = true
    if (status == true) {
        console.log(el.textContent)

        let workbook = XLSX.utils.sheet_to_row_object_array(excelfile.Sheets[el.textContent]);

        if (workbook.length > 0) {
            result[el.textContent] = workbook;
        }



        jsondata = JSON.stringify(result, null, 4);
        boxupload.classList.toggle('bg-white')
        fineshStage.style.display = "block"
        choseStage.style.display = "none"
    }
}

let fileselect = false
boxupload.addEventListener('click', function () {
    if (fileselect == false) {
        uploadimgbtn.click();
        fileselect = true
    }

})