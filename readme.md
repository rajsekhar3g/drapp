to run the app, type
npm install
node index.js

This project uses a json file like a datastore. Once the test endpoints can be verified using postman. some example calls are

to get the list of doctors http://localhost:3000/getdoctors

to get list of appointments for a given doctor uniqueid and date http://localhost:3000/getappointments?doctorId=2&date=2011-02-04

to create appointment for a given doctor uniqueid and a autogenerated appointment uniqueid with start times that are the same limited to max of 3. 
POST - localhost:3000/createappointment?doctorId=1
body
{
    "patientFirstName": "Sterling",
    "patientLastName": "Archer",
    "kind": "new",
    "startTime": "February 04, 2011 19:30:00",
    "endTime": "February 04, 2011 19:45:00"
}

to delete an appointment by doctor uniqueid and appointment uniqueid   localhost:3000/deleteappointment?doctorId=2&appointmentId=p3