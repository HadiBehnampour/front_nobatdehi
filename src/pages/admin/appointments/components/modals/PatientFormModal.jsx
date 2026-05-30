import React, { useState, useEffect } from 'react';
import BasePatientFormModal from '../../../patients/components/PatientFormModal';
import { adminService } from '../../../../../api/services/admin';

const PatientFormModal = ({ patient, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', nationalId: '', mobile: '', birthDate: '',
    insuranceType: 'none', insuranceCode: '', supplementary: 'none',
    medicalHistory: [], medications: [], allergies: '',
    surgeryHistory: false, surgeryType: '', surgeryProsthesis: false,
    isMarried: 'single', education: '', job: '', phone: '',
    referralSource: '', referralName: '', address: '',
    medicalHistoryOther: '', medicationsOther: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadedPatient, setLoadedPatient] = useState(null);

  useEffect(() => {
    const loadPatient = async () => {
	console.log("patient:", patient);
	console.log("patientId:", patient?.patientProfileId);
      if (!patient?.patientProfileId) return;
      try {
        const data = await adminService.getPatientById(patient.patientProfileId);
        setLoadedPatient(data);
      } catch (error) {
        console.error('Failed to load patient', error);
      }
    };

    loadPatient();
  }, [patient]);

  const handleSubmit = async (finalData) => {
    setIsLoading(true);
    try {
      await adminService.updatePatient(patient.patientProfileId, finalData);
      onSuccess?.();
      onClose();
    } catch {
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasePatientFormModal
      isOpen={true}
      onClose={onClose}
      initialData={loadedPatient || patient}
      formData={formData}
      setFormData={setFormData}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
};

export default PatientFormModal;
