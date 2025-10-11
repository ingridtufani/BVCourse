import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import { programData, courseData } from '../data/demoData';

const ProgramCard = ({ program }) => (
  <Card className="p-2 fade-in">
    <div className="flex items-center gap-2 mb-2">
      <span>🎓</span>
      <h3 style={{ color: 'var(--primary-color)', fontSize: '16px', margin: 0 }}>
        {program.name}
      </h3>
      <span style={{ 
        backgroundColor: 'var(--primary-light)', 
        color: 'var(--primary-color)',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: '500'
      }}>
        {program.type}
      </span>
    </div>
    <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '10px' }}>
      {program.description}
    </p>
    <div className="flex justify-between text-xs" style={{ color: 'var(--text-light)' }}>
      <span>Term: <strong>{program.term}</strong></span>
      <span>Start: <strong>{program.startDate}</strong></span>
    </div>
  </Card>
);

const CourseCard = ({ course }) => (
  <Card className="p-2 fade-in">
    <div className="flex items-center gap-2 mb-2">
      <span>📚</span>
      <h3 style={{ color: 'var(--primary-color)', fontSize: '16px', margin: 0 }}>
        {course.name}
      </h3>
    </div>
    <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '10px' }}>
      {course.description}
    </p>
    <div className="flex justify-between text-xs" style={{ color: 'var(--text-light)' }}>
      <span>Code: <strong>{course.code}</strong></span>
      <span>Term: <strong>{course.term}</strong></span>
    </div>
  </Card>
);

const Home = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section text-center">
        <div className="mb-2">
          <span style={{ fontSize: '48px' }}>✨</span>
          <h1 style={{ 
            fontSize: '2rem', 
            color: 'var(--primary-color)',
            margin: '10px 0'
          }}>
            Welcome to Bow Course Registration
          </h1>
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Register for SD department programs and courses. Explore available offerings and manage your education.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="action-section">
        <div className="grid grid-2" style={{ gap: '15px', maxWidth: '500px', margin: '0 auto' }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Card className="p-2 text-center" style={{ cursor: 'pointer', height: '100%' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span>👨‍🎓</span>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>Sign Up</h3>
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '14px', margin: 0 }}>
                Create your student account
              </p>
            </Card>
          </Link>
          
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Card className="p-2 text-center" style={{ cursor: 'pointer', height: '100%' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span>🔐</span>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>Login</h3>
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '14px', margin: 0 }}>
                Access your account
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Programs Section */}
      <section className="section">
        <h2 className="section-title">
          SD Department Programs
        </h2>
        <div className="grid grid-2">
          {programData.map(program => (
            <ProgramCard key={program.code} program={program} />
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section className="section">
        <h2 className="section-title">
          Featured Courses
        </h2>
        <div className="grid grid-2">
          {courseData.slice(0, 4).map(course => (
            <CourseCard key={course.code} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;