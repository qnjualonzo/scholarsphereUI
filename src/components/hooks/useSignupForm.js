import { useState, useEffect } from 'react';
import { authAPI, lookupAPI } from '../../services/api.js';
import { getErrorMessage } from '../utils.js';

export function useSignupForm(onSuccess) {
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [dept, setDept] = useState('');
  const [college, setCollege] = useState('');
  const [campus, setCampus] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [repeatPass, setRepeatPass] = useState('');
  const [signupError, setSignupError] = useState('');

  const [campuses, setCampuses] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownError, setDropdownError] = useState('');

  // Load campuses on component mount
  useEffect(() => {
    const initializeLookups = async () => {
      setLoading(true);
      try {
        const campusData = await lookupAPI.getCampuses();
        setCampuses(campusData || []);
        setDropdownError('');
      } catch (error) {
        console.error('Failed to load campuses:', error);
        setDropdownError('Unable to load campus data. Please refresh the page.');
        setCampuses([]);
      } finally {
        setLoading(false);
      }
    };

    initializeLookups();
  }, []);

  const handleCampusChange = async (campusId) => {
    setCampus(campusId);
    setCollege('');
    setDept('');
    setFilteredColleges([]);
    setFilteredDepartments([]);

    if (campusId) {
      try {
        const collegesData = await lookupAPI.getCollegesByCampus(campusId);
        setFilteredColleges(collegesData || []);
      } catch (error) {
        console.error('Failed to fetch colleges for campus:', error);
        setFilteredColleges([]);
      }
    }
  };

  const handleCollegeChange = async (collegeId) => {
    setCollege(collegeId);
    setDept('');
    setFilteredDepartments([]);

    if (collegeId) {
      try {
        const departmentsData = await lookupAPI.getDepartmentsByCollege(collegeId);
        setFilteredDepartments(departmentsData || []);
      } catch (error) {
        console.error('Failed to fetch departments for college:', error);
        setFilteredDepartments([]);
      }
    }
  };

  const validateForm = () => {
    if (campuses.length === 0) {
      setSignupError('Required data is not available. Please ensure the backend API is running.');
      return false;
    }

    if (!campus) {
      setSignupError('Please select a campus first.');
      return false;
    }

    if (!college || filteredColleges.length === 0) {
      setSignupError('Please select a college.');
      return false;
    }

    if (!college || filteredDepartments.length === 0) {
      setSignupError('Please select a college first, then select a department.');
      return false;
    }

    if (!firstName.trim() || !lastName.trim() || !signupEmail.trim() || !signupPass || !dept || !college || !campus) {
      setSignupError('Please fill in all required fields.');
      return false;
    }

    if (signupPass !== repeatPass) {
      setSignupError('Passwords do not match!');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    setSignupError('');

    if (!validateForm()) return;

    try {
      const userData = {
        first_name: firstName.trim(),
        middle_initial: middleInitial.trim() || null,
        last_name: lastName.trim(),
        email: signupEmail,
        password: signupPass,
        department_name: dept,
        college_name: college,
        campus_name: campus,
      };

      await authAPI.signup(userData);
      alert('Registration successful! You can now log in.');

      // Clear form
      setFirstName('');
      setMiddleInitial('');
      setLastName('');
      setSignupEmail('');
      setSignupPass('');
      setRepeatPass('');
      setDept('');
      setCollege('');
      setCampus('');

      onSuccess?.();

    } catch (error) {
      console.error('Registration failed:', error);
      const userMessage = getErrorMessage(error, 'signup');
      setSignupError(userMessage);
    }
  };

  return {
    // State
    firstName, setFirstName,
    middleInitial, setMiddleInitial,
    lastName, setLastName,
    dept, setDept,
    college, setCollege,
    campus, setCampus,
    signupEmail, setSignupEmail,
    signupPass, setSignupPass,
    repeatPass, setRepeatPass,
    signupError, setSignupError,
    campuses, setCampuses,
    filteredColleges,
    filteredDepartments,
    loading, setLoading,
    dropdownError, setDropdownError,
    // Methods
    handleCampusChange,
    handleCollegeChange,
    handleSignup,
  };
}
