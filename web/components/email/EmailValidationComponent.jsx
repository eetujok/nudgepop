import React, { useEffect } from 'react';
import './emailForm.css';

const EmailValidationComponent = () => {
  useEffect(() => {
    const $field = document.getElementById('email');
    const $iconWrong = document.getElementById('iconWrong');
    const $iconPassed = document.getElementById('iconPassed');
    const $container = $field.closest('.email-container'); // Get the parent container

    const handleFocus = () => {
      $field.parentNode.classList.add('focus');
      $field.parentNode.classList.remove('active');
    };

    const handleBlur = () => {
      $field.parentNode.classList.remove('focus');
      if ($field.value !== "") {
        $field.parentNode.classList.add('active');
        if (isValidEmailAddress($field.value)) {
          $container.classList.add('emailActivated'); // Add class on valid email
        } else {
          $container.classList.remove('emailActivated'); // Remove class on invalid email
        }
      } else {
        $field.parentNode.classList.remove('active');
        $container.classList.remove('emailActivated'); // Remove class when input is empty
        document.querySelectorAll('.iconCheck').forEach(icon => icon.style.display = 'none');
      }
    };

    const handleKeydown = () => {
      const emailaddress = $field.value;
      if (!isValidEmailAddress(emailaddress)) {
        $iconPassed.style.display = 'none';
        $iconWrong.style.display = 'inline';
        $container.classList.remove('emailActivated'); // Remove class on invalid email
      } else {
        $iconPassed.style.display = 'inline';
        $iconWrong.style.display = 'none';
        $container.classList.add('emailActivated'); // Add class on valid email
      }
    };

    const isValidEmailAddress = (emailAddress) => {
      return emailAddress.includes('@');
    };

    $field.addEventListener('focus', handleFocus);
    $field.addEventListener('blur', handleBlur);
    $field.addEventListener('keydown', handleKeydown);

    return () => {
      $field.removeEventListener('focus', handleFocus);
      $field.removeEventListener('blur', handleBlur);
      $field.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div className="email-container">
      <span className="fieldRow">
        <input id="email" type="email" placeholder="example@domain.com" />
        <label htmlFor="email">Your email</label>
        <i className="fa fa-envelope-o"></i>
        <i id="iconWrong" className="iconCheck fa fa-times"></i>
        <i id="iconPassed" className="iconCheck fa fa-check"></i>
        <button className="emailFormSubmit" id="email-submit">Subscribe</button>
      </span>
    </div>
  );
};

export default EmailValidationComponent;
