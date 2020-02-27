const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const moment = require('moment');
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
                    appointmentList.push({patientFirstName:appointment.patientFirstName, patientLastName:appointment.patientLastName, startTime:appointment.startTime, endTime:appointment.endTime })
                }
            }
        }
           
    }
    res.json(appointmentList);

});

app.post('/createappointment', (req, res)=>{
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
                    appointmentList.push({patientFirstName:appointment.patientFirstName, patientLastName:appointment.patientLastName, startTime:appointment.startTime, endTime:appointment.endTime })
                }
            }
        }
           
    }
    res.json(appointmentList);

});

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
    res.send('Got a DELETE request at /user and it was a success')
    else
    res.send('Got a DELETE request at /user and it failed')

  })



app.listen(port, () => console.log(`Example app listening on port ${port}!`))