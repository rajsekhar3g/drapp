const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const moment = require('moment');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('app is running'))

//example:http://localhost:3000/getdoctors
app.get('/getdoctors', (req, res)=>{
    let rawdata = fs.readFileSync('data.json');
    let physiciansObject = JSON.parse(rawdata);
    let doctorsList = [];
    for(let physician of physiciansObject.physicians){
        doctorsList.push({firstName:physician.firstName, lastName:physician.lastName, uniqueId:physician.uniqueId});
    }
    res.json(doctorsList);

});

//example:http://localhost:3000/getappointments?doctorId=2&date=2011-02-04
app.get('/getappointments', (req, res)=>{
    let doctorUniqueId = req.query.doctorId;
    let date = req.query.date;
    let rawdata = fs.readFileSync('data.json');
    let physiciansObject = JSON.parse(rawdata);
    let appointmentList = [];
    for(let physician of physiciansObject.physicians){
        if(physician.uniqueId == doctorUniqueId)
        {
            for(let appointment of physician.calendar){
                if(moment(date).isSame(appointment.startTime, 'day'))
                {
                    appointmentList.push({patientFirstName:appointment.patientFirstName, patientLastName:appointment.patientLastName, startTime:appointment.startTime, endTime:appointment.endTime, kind:appointment.kind })
                }
            }
        }
           
    }
    res.json(appointmentList);

});
/*
POST - localhost:3000/createappointment?doctorId=1
body
{
    "patientFirstName": "Sterling",
    "patientLastName": "Archer",
    "kind": "new",
    "startTime": "February 04, 2011 19:30:00",
    "endTime": "February 04, 2011 19:45:00"
}*/
app.post('/createappointment', (req, res)=>{
    let doctorUniqueId = req.query.doctorId;
    let appointmentBody = req.body;


    let startTime = moment(appointmentBody.startTime);
    let endTime = moment(appointmentBody.endTime);
    let success = false;
    let sameStartTimeCount = 0;
    if(startTime.minutes()%15==0)
    {
    appointmentBody.uniqueId = Date.now();
    let rawdata = fs.readFileSync('data.json');
    let physiciansObject = JSON.parse(rawdata);
    for(const [i,physician] of physiciansObject.physicians.entries()){
        for(const [j,appointment] of physician.calendar.entries()){
            if(moment(appointment.startTime).isSame(appointmentBody.startTime)){
                sameStartTimeCount++;   
            }
        }
        if(physician.uniqueId == doctorUniqueId & sameStartTimeCount<3)
        {
            physician.calendar.push(appointmentBody);
            fs.writeFileSync('data.json', JSON.stringify(physiciansObject));
            success = true;
        }
        
    }
    }
    
    if(success)
    res.send('Got a POST request at /createappointment and it was a success')
    else
    res.send('Got a POST request at /createappointment and it failed')

});
//localhost:3000/deleteappointment?doctorId=2&appointmentId=p3
app.delete('/deleteappointment', function (req, res) {
    let doctorUniqueId = req.query.doctorId;
    let appointmentId = req.query.appointmentId;
    let rawdata = fs.readFileSync('data.json');
    let physiciansObject = JSON.parse(rawdata);
    let success = false;
    for(const [i,physician] of physiciansObject.physicians.entries()){
        if(physician.uniqueId == doctorUniqueId)
        {
            for(const [j,appointment] of physician.calendar.entries()){
            if(appointment.uniqueId == appointmentId){
                delete physiciansObject.physicians[i].calendar[j];
                fs.writeFileSync('data.json', JSON.stringify(physiciansObject));
                success = true;
            }
            }
        }
    }
    if(success)
    res.send('Got a DELETE request at /deleteappointment and it was a success')
    else
    res.send('Got a DELETE request at /deleteappointment and it failed')

  })



app.listen(port, () => console.log(`Example app listening on port ${port}!`))