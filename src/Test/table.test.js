import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TableForm from '../components/table';


describe('Table component', () => {
  const renderTable = () => {
    render(<TableForm />);
  };

  test('displays modal when "Add Employee" button is clicked', () => {
    renderTable();
    fireEvent.click(screen.getByText(/add employee/i));
    expect(screen.getByText(/name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();

  });
  test('displays table headers', () => {
    renderTable();
  
    expect(screen.getByText(/id/i)).toBeInTheDocument();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/age/i)).toBeInTheDocument();
    expect(screen.getByText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/phone/i)).toBeInTheDocument();
    expect(screen.getByText(/salary/i)).toBeInTheDocument();
    expect(screen.getByText(/gender/i)).toBeInTheDocument();
    expect(screen.getByText(/action/i)).toBeInTheDocument();
  });
 

});
