function toggle() { 
    var toggle = document.getElementById('createSchema');
    var button1 =document.getElementById('testButton');
    if (toggle.style.display == 'none') {
        button1.value = "Hide bookings";
        toggle.style.display = 'block'; 
    } else {
        button1.value = "Create a new booking";
        toggle.style.display = 'none';    
    }
}