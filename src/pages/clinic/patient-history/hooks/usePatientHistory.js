import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { adminService } from '../../../../api';
import { calcBMI } from '../utils/bmi';

export function usePatientHistory(patientId) {
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [clinical, setClinical] = useState({
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    medications: '',
    surgeryHistory: false,
    surgeryType: '',
    surgeryProsthesis: false,
    height: '',
    weight: '',
  });
  const [isEditingClinical, setIsEditingClinical] = useState(false);
  const [savingClinical, setSavingClinical] = useState(false);
  const [savingEncounter, setSavingEncounter] = useState(false);

  const requestIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!patientId) return;

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setPatient(null);
    setAppointments([]);

    try {
      const data = await adminService.getPatientHistory(patientId);

      if (requestId !== requestIdRef.current) return;

      setPatient(data.patient);
      setAppointments(data.appointments || []);

      const medicalHistoryText = Array.isArray(data.patient?.medicalHistory)
        ? data.patient.medicalHistory.join('، ')
        : '';

      const medicationsText = Array.isArray(data.patient?.medications)
        ? data.patient.medications.join('، ')
        : '';

      setClinical({
        bloodType: data.patient?.bloodType || '',
        allergies: data.patient?.allergies || '',
        chronicDiseases: medicalHistoryText,
        medications: medicationsText,
        surgeryHistory: data.patient?.surgeryHistory || false,
        surgeryType: data.patient?.surgeryType || '',
        surgeryProsthesis: data.patient?.surgeryProsthesis || false,
        height: data.patient?.height || '',
        weight: data.patient?.weight || '',
      });
    } catch (error) {
      console.error('خطا در دریافت پرونده بیمار', error);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = useMemo(() => {
    const height = Number(clinical.height) || 170;
    const withWeight = appointments
      .filter(a =>
        ['completed', 'paid'].includes(a.status) &&
        a.encounter &&
        a.encounter.weight != null
      )
      .map(a => {
        const w = Number(a.encounter.weight);
        const h = a.encounter.height ? Number(a.encounter.height) : height;
        return {
          date: (a.date || '').split('/').slice(1).join('/') || a.date,
          weight: w,
          bmi: calcBMI(w, h) ?? calcBMI(w, height),
        };
      })
      .filter(d => d.weight > 0);
    return withWeight.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [appointments, clinical.height]);

  const todayAppointment = useMemo(() => {
    return appointments.find(a =>
      a.is_today === true &&
      ['reserved', 'confirmed', 'in_progress', 'ready_for_payment'].includes(a.status)
    );
  }, [appointments]);

  const draftEncounter = useMemo(() => {
    if (!todayAppointment?.encounter) return null;
    if (['completed', 'paid'].includes(todayAppointment.status)) return null;
    return todayAppointment.encounter;
  }, [todayAppointment]);

  const handleSaveClinical = async () => {
    setSavingClinical(true);
    try {
      const medicalHistoryArray = clinical.chronicDiseases
        ? clinical.chronicDiseases.split('،').map(i => i.trim()).filter(Boolean)
        : [];

      const medicationsArray = clinical.medications
        ? clinical.medications.split('،').map(i => i.trim()).filter(Boolean)
        : [];

      const payload = {
        bloodType: clinical.bloodType,
        allergies: clinical.allergies,
        height: clinical.height === "" ? null : Number(clinical.height),
	weight: clinical.weight === "" ? null : Number(clinical.weight),
        medicalHistory: medicalHistoryArray,
        medications: medicationsArray,
        surgeryHistory: clinical.surgeryHistory,
        surgeryType: clinical.surgeryHistory ? clinical.surgeryType : '',
        surgeryProsthesis: clinical.surgeryProsthesis,
      };

      await adminService.updatePatientClinical(patientId, payload);

      setIsEditingClinical(false);
    } catch (error) {
      alert('خطا در ذخیره اطلاعات بالینی');
      console.log('SERVER ERROR:', error.response?.data);
    } finally {
      setSavingClinical(false);
    }
  };

  const handleSubmitCurrentVisit = async (formData) => {
    const apt = todayAppointment;
    if (!apt?.id) {
      alert('برای ثبت ویزیت جاری، ابتدا از بخش نوبت‌دهی برای این بیمار نوبت امروز ثبت کنید.');
      return false;
    }
    setSavingEncounter(true);
    try {
      await adminService.saveEncounter(apt.id, {
        chiefComplaint: formData.chiefComplaint || apt.reason || '',
        diagnosis: formData.diagnosis || '',
        prescription: formData.prescription || '',
        doctorAdvice: '',
        physicalExam: formData.physicalExam || '',
        weight: formData.weight,
        height: formData.height || clinical.height,
      });
      await fetchData();
      return true;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'خطا در ثبت ویزیت');
      return false;
    } finally {
      setSavingEncounter(false);
    }
  };

  return {
    loading,
    patient,
    appointments,
    clinical,
    setClinical,
    isEditingClinical,
    setIsEditingClinical,
    savingClinical,
    handleSaveClinical,
    chartData,
    savingEncounter,
    handleSubmitCurrentVisit,
    fetchData,
    todayAppointment,
    draftEncounter,
  };
}
