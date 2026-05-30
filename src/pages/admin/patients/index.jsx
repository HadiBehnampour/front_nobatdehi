import React from 'react';
import usePatients from './hooks/usePatients';
import PatientsHeader from './components/PatientsHeader';
import PatientsTable from './components/PatientsTable';
import PatientFormModal from './components/PatientFormModal';
import PatientsImportModal from './components/PatientsImportModal';

const AdminPatients = () => {
  const {
    loading, saving, filteredPatients,
    searchTerm, filterInsurance,
    showAddModal, editingPatient, formData,
    setSearchTerm, setFilterInsurance,
    setShowAddModal, setFormData,
    openAddModal, openEditModal,
    handleDelete, handleFormSubmit, goToHistory,
    showImportModal, openImportModal, closeImportModal,
    uploadExcel, importLoading, importResult, importError,
    setEditingPatient,
  } = usePatients();

  // تابع بستن مودال
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      nationalId: '',
      mobile: '',
      birthDate: '',
      isMarried: 'single',
      education: '',
      job: '',
      phone: '',
      address: '',
      insuranceType: '',
      insuranceCode: '',
      supplementary: '',
      surgeryHistory: false,
      surgeryType: '',
      surgeryProsthesis: false,
      medicalHistory: [],
      medications: [],
      referralSource: '',
      referralName: '',
      allergies: '',
      chronicDiseases: '',
      bloodType: '',
      height: '',
      weight: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 text-right" dir="rtl">

      <PatientsHeader
        loading={loading}
        filteredCount={filteredPatients.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterInsurance={filterInsurance}
        setFilterInsurance={setFilterInsurance}
        openAddModal={openAddModal}
        openImportModal={openImportModal}
      />

      <PatientsTable
        loading={loading}
        patients={filteredPatients}
        openEditModal={openEditModal}
        goToHistory={goToHistory}
        handleDelete={handleDelete}
      />

      <PatientFormModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingPatient}
        formData={formData}
        setFormData={setFormData}
        isLoading={saving}
      />

      <PatientsImportModal
        show={showImportModal}
        onClose={closeImportModal}
        uploadExcel={uploadExcel}
        loading={importLoading}
        result={importResult}
        error={importError}
      />
    </div>
  );
};

export default AdminPatients;
