const registerformel = document.getElementById("registerform");
if(registerformel){
    registerformel.addEventListener('submit',(e)=>{
        e.preventDefault();
        if($('#password').val() != $('#cpassword').val()){
            swal("Both passowrd is not match")
        }else{
            $.ajax({
                url:"register",
                method:"post",
                data:$('#registerform').serialize(),
                success:function(res){
                    console.log(res);
                   if(res.status){
                    swal(res.message)
                    $('#registerform')[0].reset();
                   }else{
                    swal(res.message)                    
                   }
                },
                error:function(err){
                    $('#registerform')[0].reset();
                    console.log(err);
                   swal(err.responseJSON.message)
                }
            }) 
        }
    })    
}


///////// forgot password
const forgotpassel = document.getElementById("forgotpass");
if(forgotpassel){
    forgotpassel.addEventListener('submit',(e)=>{
        e.preventDefault();
        const email = $("#email").val();
        if(!email){
            swal("please enter email");
            return
        }else{
            $.ajax({
                url:"/forgotpass",
                method:"post",
                data:$('#forgotpass').serialize(),
                success:function(res){
                    console.log(res);
                   if(res.status){
                    $('#forgotpass')[0].reset();
                    swal(res.message)
                   }else{
                    swal(res.message)
                   }
                },
                error:function(err){
                    $('#forgotpass')[0].reset();
                   swal(err.responseJSON.message)
                }
            })
        }
     
    })
}


const genratepassel = document.getElementById("genratepass");
if(genratepassel){
    genratepassel.addEventListener('submit',(e)=>{
        e.preventDefault();
        console.log($('#genratepass').serialize());
        const newpass = $("#newpass").val();
        const confpass = $("#confpass").val();
        if(!newpass || !confpass){
            swal("all field required");
            return
        }
        else if(newpass != confpass){
            swal("both password not match");
            return
        }
        else{
            arr = window.location.href.split('/');
            token = arr[arr.length-1];
            $.ajax({
                url:"/genratrenewpass",
                method:"post",
                // data:$('#genratepass').serialize(),
                data:"newpass="+newpass+"&confpass="+confpass+"&resetLink="+token,
                success:function(res){
                    console.log(res);
                   if(res.status){
                    $('#genratepass')[0].reset();
                    swal(res.message)
                   }else{
                    swal(res.message)
                   }
                },
                error:function(err){
                    $('#genratepass')[0].reset();
                   swal(err.responseJSON.message)
                }
            })
        }
     
    })
}

