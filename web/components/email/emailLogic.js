// Create the HTML structure
const emailContainer = document.createElement('div');
emailContainer.className = 'email-container';
emailContainer.innerHTML = `
    <span class="fieldRow">
        <input id="email" type="email" placeholder="example@domain.com" />
        <label for="email">Email</label>
        <i class="fa fa-envelope-o"></i>
        <i id="iconWrong" class="iconCheck fa fa-times"></i>
        <i id="iconPassed" class="iconCheck fa fa-check"></i>
    </span>
`;

// Append the HTML structure to the body
document.body.appendChild(emailContainer);

// JavaScript functionality
const $field = document.querySelector('input');
const $iconWrong = document.getElementById('iconWrong');
const $iconPassed = document.getElementById('iconPassed');

$field.addEventListener('focus', function() {
  this.parentNode.classList.add('focus');
  this.parentNode.classList.remove('active');
});

$field.addEventListener('blur', function() {
  this.parentNode.classList.remove('focus');
  
  if ($field.value !== "") {
    this.parentNode.classList.add('active');
  } else {
    this.parentNode.classList.remove('active');
    document.querySelectorAll('.iconCheck').forEach(icon => icon.style.display = 'none');
  }
});

$field.addEventListener('keydown', function() {
  const emailaddress = $field.value;
  
  if (!isValidEmailAddress(emailaddress)) { 
    $iconPassed.style.display = 'none'; 
    $iconWrong.style.display = 'inline';
  } else {
    $iconPassed.style.display = 'inline'; 
    $iconWrong.style.display = 'none';
  }
});

function isValidEmailAddress(emailAddress) {
    return emailAddress.includes('@');
}
