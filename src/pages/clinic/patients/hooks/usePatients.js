import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../../api';

const INITIAL_FORM = {
  name: '',
  nationalId: '',
  mobile: '',
  birthDate: '',
  isMarried: 'single',
  education: '',
  job: '',
  phone: '',
  address: '',
  insuranceType: 'none',
  insuranceCode: '',
  supplementary: 'none',
  medicalHistory: [],
  medications: [],
  medicalHistoryOther: '',
  medicationsOther: '',
  surgeryHistory: false,
  surgeryProsthesis: false,
  surgeryType: '',
  allergies: '',
  chronicDiseases: '',
  bloodType: '',
  height: '',
  weight: '',
  referralSource: '',
  referralName: ''
};

const usePatients = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterInsurance, setFilterInsurance] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getPatients(debouncedSearch);
      if (Array.isArray(data)) {
        setPatients(data);
      } else if (data && Array.isArray(data.results)) {
        setPatients(data.results);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('❌ خطا در دریافت لیست بیماران:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter(p => filterInsurance === 'all' || p.insuranceType === filterInsurance);

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف پرونده اطمینان دارید؟')) {
      try {
        await adminService.deletePatient(id);
        setPatients(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('❌ Delete error:', error);
        alert('خطا در حذف پرونده');
      }
    }
  };

  const openAddModal = () => {
    setEditingPatient(null);
    setFormData(INITIAL_FORM);
    setShowAddModal(true);
  };

  const openEditModal = async (patient) => {
	    try {
	      const fullPatient = await adminService.getPatientById(patient.id);

	      const cleanBirth = fullPatient.birthDate || '';

	      setEditingPatient(fullPatient);
	      setFormData({
		...INITIAL_FORM,
		...fullPatient,
		birthDate: cleanBirth,
		medicalHistory: Array.isArray(fullPatient.medicalHistory) ? fullPatient.medicalHistory : [],
		medications: Array.isArray(fullPatient.medications) ? fullPatient.smedications : [],
		medicalHistoryOther: '',
		medicationsOther: ''
	      });
	      setShowAddModal(true);
	    } catch (error) {
	      console.error('❌ Error loading patient:', error);
	      alert('خطا در دریافت اطلاعات بیمار');
	    }
  };

  const handleFormSubmit = async (data) => {
    setSaving(true);

    const safeData = data || formData;

    const preparedData = {
      ...safeData,
      medicalHistory: Array.isArray(safeData.medicalHistory) ? [...safeData.medicalHistory] : [],
      medications: Array.isArray(safeData.medications) ? [...safeData.medications] : []
    };

    delete preparedData.medicalHistoryOther;
    delete preparedData.medicationsOther;

    // ✅ FIX: جلوگیری از ارسال string خالی برای ChoiceField
    if (preparedData.referralSource === '') {
      preparedData.referralSource = null;
    }

    try {
      if (editingPatient) {
        await adminService.updatePatient(editingPatient.id, preparedData);
      } else {
        await adminService.createPatient(preparedData);
      }
      setShowAddModal(false);
      fetchPatients();
    } catch (error) {
      console.error('❌ Submit error:', error);
      console.log('📥 Backend response:', error.response?.data);
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setSaving(false);
    }
  };

  const goToHistory = (patient) => {
    navigate(`/admin/patient-history/${patient.id}`);
  };

  const openImportModal = () => {
    setShowImportModal(true);
    setImportResult(null);
    setImportError(null);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportResult(null);
    setImportError(null);
  };

  const uploadExcel = async (file) => {
    if (!file) return;
    setImportLoading(true);
    setImportError(null);
    setImportResult(null);
    try {
      const result = await adminService.uploadPatientsExcel(file);
      setImportResult(result);
      fetchPatients();
    } catch (error) {
      const serverData = error.response?.data;
      if (serverData && serverData.error) {
        setImportError(serverData.error);
      } else {
        setImportError('خطا در آپلود فایل. لطفاً مجدداً تلاش کنید.');
      }
    } finally {
      setImportLoading(false);
    }
  };

  return {
    loading,
    saving,
    filteredPatients,
    searchTerm,
    filterInsurance,
    showAddModal,
    editingPatient,
    formData,
    showImportModal,
    importLoading,
    importResult,
    importError,
    setSearchTerm,
    setFilterInsurance,
    setShowAddModal,
    setFormData,
    setEditingPatient,
    openAddModal,
    openEditModal,
    handleDelete,
    handleFormSubmit,
    goToHistory,
    openImportModal,
    closeImportModal,
    uploadExcel,
  };
};

export default usePatients;
