import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserPlus, faSort } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

const TableForm = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [validName, setValidName] = useState(true);
  const [validAge, setValidAge] = useState(true);
  const [validDob, setValidDob] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPhone, setValidPhone] = useState(true);
  const [validSalary, setValidSalary] = useState(true);
  const [validGender, setValidGender] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('employeeData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('employeeData', JSON.stringify(data));
  }, [data]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewEmployee({});
    setSelectedEmployee(null);
    resetValidations();
  };

  const saveEmployee = () => {
    if (validateForm()) {
      const newId = data.length + 1;
      const employeeData = { ...newEmployee, id: newId };
      const newData = [...data, employeeData];
      setData(newData);
      closeModal();
    }
  };

  const updateEmployee = () => {
    if (validateForm()) {
      const updatedData = data.map((item) => {
        if (item.id === selectedEmployee.id) {
          return { ...item, ...newEmployee };
        }
        return item;
      });
      setData(updatedData);
      closeModal();
    }
  };

  const handleEdit = (id, field, value) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(newData);
  };

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({ ...employee });
    setShowModal(true);
    resetValidations();
  };

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === 'name') {
      const valueA = a.name;
      const valueB = b.name;

      if (sortConfig.direction === 'ascending') {
        return valueA.localeCompare(valueB);
      } else if (sortConfig.direction === 'descending') {
        return valueB.localeCompare(valueA);
      }
    }
    return 0;
  });

  // Filtering logic
  const filteredData = sortedData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    let isValid = true;

    if (!newEmployee.name) {
      setValidName(false);
      isValid = false;
    } else {
      setValidName(true);
    }

    if (!newEmployee.age || newEmployee.age <= 0) {
      setValidAge(false);
      isValid = false;
    } else {
      setValidAge(true);
    }

    if (!newEmployee.dob || !isValidDate(newEmployee.dob)) {
      setValidDob(false);
      isValid = false;
    } else {
      setValidDob(true);
    }

    if (!newEmployee.email || !isValidEmail(newEmployee.email)) {
      setValidEmail(false);
      isValid = false;
    } else {
      setValidEmail(true);
    }

    if (!newEmployee.phone || !isValidPhone(newEmployee.phone)) {
      setValidPhone(false);
      isValid = false;
    } else {
      setValidPhone(true);
    }

    if (!newEmployee.salary) {
      setValidSalary(false);
      isValid = false;
    } else {
      setValidSalary(true);
    }

    if (!newEmployee.gender) {
      setValidGender(false);
      isValid = false;
    } else {
      setValidGender(true);
    }

    return isValid;
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      return false;
    }
    return true;
  };

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const resetValidations = () => {
    setValidName(true);
    setValidAge(true);
    setValidDob(true);
    setValidEmail(true);
    setValidPhone(true);
    setValidSalary(true);
    setValidGender(true);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="search-container">
          {filteredData.length > 0 && (
            <label>
              <span className="search-label">Search:</span>
              <input type="text" value={searchTerm} placeholder="SearchbyID or Name" onChange={handleSearch} className="search-input" />
            </label>
          )}
        </div>
        <button className="add-employee-button" onClick={openModal}>
          <FontAwesomeIcon icon={faUserPlus} /> Add Employee
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <label>
              Name:
              <input
                type="text"
                value={newEmployee.name || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                required
                maxLength={50}
                className={!validName ? 'invalid' : ''}
              />
              {!validName && <span className="error-message">Name is required</span>}
            </label>
            <label>
              Age:
              <input
                type="number"
                value={newEmployee.age || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, age: e.target.value })}
                required
                className={!validAge ? 'invalid' : ''}
              />
              {!validAge && <span className="error-message">Age is required</span>}
            </label>
            <label>
              Date of Birth:
              <input
                type="text"
                value={newEmployee.dob || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, dob: e.target.value })}
                required
                maxLength={10}
                className={!validDob ? 'invalid' : ''}
              />
              {!validDob && <span className="error-message">Date of birth is
                required - Date (DD-
                MM-YY)</span>}
            </label>
            <label>
              Email:
              <input
                type="email"
                value={newEmployee.email || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                className={!validEmail ? 'invalid' : ''}
              />
              {!validEmail && <span className="error-message">Please enter the
                valid Email
                (abc@xyz.com)</span>}
            </label>
            <label>
              Phone:
              <input
                type="text"
                value={newEmployee.phone || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                required
                pattern="[0-9]{10}"
                className={!validPhone ? 'invalid' : ''}
              />
              {!validPhone && <span className="error-message">Phone number
                should be 10
                digits.</span>}
            </label>
            <label>
              Salary:
              <input
                type="text"
                value={newEmployee.salary || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                required
                maxLength={6}
                className={!validSalary ? 'invalid' : ''}
              />
              {!validSalary && <span className="error-message">Salary is required</span>}
            </label>
            <label>
  Gender:
  <div className={!validGender ? 'radio-group error' : 'radio-group'}>
    <label className={!validGender ? 'radio-label error' : 'radio-label'}>
      <input
        type="radio"
        id="male"
        name="gender"
        value="Male"
        checked={newEmployee.gender === 'Male'}
        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
        className={!validGender ? 'radio-input invalid' : 'radio-input'}
      />
      <span className={!validGender ? 'radio-label error' : 'radio-label'} style={{ color: !validGender ? 'black' : 'inherit' }}>Male</span>
    </label>
    <label className={!validGender ? 'radio-label error' : 'radio-label'}>
      <input
        type="radio"
        id="female"
        name="gender"
        value="Female"
        checked={newEmployee.gender === 'Female'}
        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
        className={!validGender ? 'radio-input invalid' : 'radio-input'}
      />
      <span className={!validGender ? 'radio-label error' : 'radio-label'} style={{ color: !validGender ? 'black' : 'inherit' }}>Female</span>
    </label>
  </div>
  {!validGender && <span className="error-message">Gender is required</span>}
</label>

            {selectedEmployee ? (
              <>
                <button onClick={updateEmployee}>Update</button>
                <button onClick={closeModal}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={saveEmployee}>Save</button>
                <button onClick={closeModal}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => handleSort('name')}>
              Name {sortConfig.key === 'name' && (
                <FontAwesomeIcon
                  icon={faSort}
                  className={`sort-icon ${sortConfig.direction === 'ascending' ? 'ascending' : 'descending'}`}
                />
              )}
            </th>
            <th>Age</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Salary</th>
            <th>Gender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <span className="table-field">{item.name}</span>
                ) : (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleEdit(item.id, 'name', e.target.value)}
                    required
                    maxLength={50}
                    className={!validName ? 'table-input invalid' : 'table-input'}
                  />
                )}
              </td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <span className="table-field">{item.age}</span>
                ) : (
                  <input
                    type="number"
                    value={item.age}
                    onChange={(e) => handleEdit(item.id, 'age', e.target.value)}
                    required
                    className={!validAge ? 'table-input invalid' : 'table-input'}
                  />
                )}
              </td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <span className="table-field">{item.dob}</span>
                ) : (
                  <input
                    type="text"
                    value={item.dob}
                    onChange={(e) => handleEdit(item.id, 'dob', e.target.value)}
                    required
                    maxLength={10}
                    className={!validDob ? 'table-input invalid' : 'table-input'}
                  />
                )}
              </td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <span className="table-field">{item.email}</span>
                ) : (
                  <input
                    type="email"
                    value={item.email}
                    onChange={(e) => handleEdit(item.id, 'email', e.target.value)}
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    className={!validEmail ? 'table-input invalid' : 'table-input'}
                  />
                )}
              </td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <span className="table-field">{item.phone}</span>
                ) : (
                  <input
                    type="text"
                    value={item.phone}
                    onChange={(e) => handleEdit(item.id, 'phone', e.target.value)}
                    required
                    pattern="[0-9]{10}"
                    className={!validPhone ? 'table-input invalid' : 'table-input'}
                  />
                )}
              </td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <span className="table-field">{item.salary}</span>
                ) : (
                  <input
                    type="text"
                    value={item.salary}
                    onChange={(e) => handleEdit(item.id, 'salary', e.target.value)}
                    required
                    maxLength={6}
                    className={!validSalary ? 'table-input invalid' : 'table-input'}
                  />
                )}
              </td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <span className="table-field">{item.gender}</span>
                ) : (
                  <input
                    type="text"
                    value={item.gender}
                    onChange={(e) => handleEdit(item.id, 'gender', e.target.value)}
                    required
                    maxLength={50}
                    className={!validGender ? 'table-input invalid' : 'table-input'}
                  />
                )}
              </td>
              <td>
                {selectedEmployee && selectedEmployee.id === item.id ? (
                  <button className="edit-button" onClick={() => handleUpdate(item)}>
                    Update
                  </button>
                ) : (
                  <>
                    <div className="button-container">
                      <button className="edit-button" onClick={() => handleUpdate(item)}>
                        <FontAwesomeIcon icon={faEdit} /> Update
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(item.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableForm;
