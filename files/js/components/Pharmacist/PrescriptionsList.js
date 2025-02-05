import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchPatient from './../SearchPatient'
import PrescriptionDetails from './PrescriptionDetails';

function PrescriptionList() {
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [viewClicked, setViewClicked] = useState([]);
  const [iscreatenewprescription , setiscreatenewprescription]= useState(false);
  const token = localStorage.getItem('token');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

    const fetchPrescriptions = async (name) => {
    try {

      const response = await axios.get(`/api/get/pharmacist/shared/prescriptions`,  {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: process.env.timeout  // Set timeout to 2 seconds
    });

      console.log(response.data);
      setPrescriptionList(response.data);


    } catch (error) {
      console.error('Error fetching Family History records:', error);
    }
  };

  const dispensePrescription = async(id) => {
    try {

      const data = {
        prescription_id : id
      }
      const response = await axios.post(`/api/create/prescription/dispensation`, data ,  {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: process.env.timeout  // Set timeout to 2 seconds

    });
      setSuccessMessage('Dispense prescription successfully');



    } catch (error) {
      console.error('Error fetching Family History records:', error);
    }
  }


useEffect(() => {
    fetchPrescriptions('');
  }, []);

    const SearchPrescriptions = async (filterpatient) => {
    try {

      const response = await axios.get(`/api/get/pharmacist/shared/prescriptions?name=${filterpatient}`,  {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: process.env.timeout  // Set timeout to 2 seconds
    })


      console.log(response.data);
      setPrescriptionList(response.data);


    } 
    catch (error) {
      console.error('Error fetching Family History records:', error);
    }
  };



    const CreateNewPrescription = () => {
      setiscreatenewprescription(!iscreatenewprescription)

    }

  const handleViewClick = (id) => {
    setViewClicked(prevClicked => ({
      ...prevClicked,
      [id]: !prevClicked[id]
    }));
  };

  return (
    <div className="prescription-list">
      <h2>Shared Prescriptions</h2>

      
      <SearchPatient search={SearchPrescriptions}/>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Prescribed By</th>
            <th>Description</th>
            <th>Date</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prescriptionList.map((prescription) => (
            <React.Fragment key={prescription.id}>
              <tr>
                <td>{prescription.user_firstname} {prescription.user_lastname}</td>
                <td>{prescription.provider_firstname} {prescription.provider_lastname}</td>
                <td>{prescription.description}</td>
                <td>{prescription.created_at ? new Date(prescription.created_at).toISOString().split('T')[0] : "Invalid Date"}</td>
                <td>{prescription.status}</td>
                <td>
                  
                  {viewClicked[prescription.id] && <button onClick={() => handleViewClick(prescription.id)}>Close</button>}
                  
                  
                  {!viewClicked[prescription.id] && <button onClick={() => handleViewClick(prescription.id)}>View</button>}
                  <b>   </b>
                  {viewClicked[prescription.id] && <button onClick={() => dispensePrescription(prescription.id)}>Dispense</button>}
                </td>
              </tr>
              {viewClicked[prescription.id] && (
                <tr>
                  <td colSpan="5">
                    <PrescriptionDetails PrescriptionId={prescription.id}  />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
);
}

export default PrescriptionList;
