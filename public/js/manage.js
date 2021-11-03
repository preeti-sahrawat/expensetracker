const expenceformel = document.getElementById("addexpense")
if (expenceformel) {
    expenceformel.addEventListener('submit', (e) => {
        e.preventDefault();
        const formdata = $("#addexpense").serialize();
        $.ajax({
            url: $("#addexpense").attr("action"),
            type: "POST",
            data: formdata,
            success: function (data) {
                $("#addexpense")[0].reset();
                if (data.status) {
                    swal(data.message)
                }
            },
            error: function (err) {
                $("#addexpense")[0].reset();
                if (err.status) {
                    swal(data.message);
                }
            }
        })
    })
}


// add company information

const addCompanyForm = document.getElementById("addCompanyForm");
if (addCompanyForm) {
    $("#addCompanyForm").on('submit', (e) => {
        e.preventDefault();
        const companyname = $("#companyname").val();
        const salery = $("#salery").val();
        const joindate = $("#joindate").val();
        const degination = $("#degination").val();

        var docs = document.getElementById('docs').files[0];
        const remark = $("#remark").val();
        if (!companyname || !salery || !joindate) {
            swal("Companyname salery or joindate required");
        } else if (isNaN(salery)) {
            swal("Enter valid salery");
        } else {
            let form_data = new FormData();
            form_data.append('companyname', companyname);
            form_data.append('salery', salery);
            form_data.append('joindate', joindate);
            form_data.append('degination', degination);
            form_data.append('doc', docs);
            form_data.append('remark', remark);
            $.ajax({
                url: "/api/addcompany",
                type: 'POST',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: function () {
                    $("#addCompanybtn").prop('disabled', true);
                    $('#addCompanybtn').val('Please Wait....');

                },
                success: function (data) {
                    $("#addCompanybtn").prop('disabled', false);
                    $('#addCompanybtn').val('Add Company');
                    if (data.status) {
                        swal(data.message)
                        $("#addCompanyForm")[0].reset();
                    }
                },
                error: function () {
                    swal("Something went wrong");
                    $("#addCompanybtn").prop('disabled', false);
                    $('#addCompanybtn').val('Add Company');
                }
            })
        }

    })
}


///////////////////// updateprofile
const updateprofile = document.getElementById("updateprofile");
if (updateprofile) {
    updateprofile.addEventListener('submit', (e) => {
        e.preventDefault();
        const formdata = $("#updateprofile").serialize();
        $.ajax({
            url: "/updatepass",
            type: "PUT",
            data: formdata,
            success: function (data) {
                console.log(data);
                if (data.status) {
                    swal(data.message)
                }
            },
            error: function (err) {
                if (!err.status >= 400) {
                    swal(data.message);
                }
            }
        })
    })
}


/////// change pass
const changepass = document.getElementById('changepass');
if (changepass) {
    changepass.addEventListener('submit', (e) => {
        e.preventDefault();
        // validation
        oldpass = $("#oldpass").val();
        newpass = $("#newpass").val();
        cpass = $("#cpass").val();

        if (!oldpass || !newpass || !cpass) {
            swal("All field required");
            return;
        }

        if (newpass != cpass) {
            swal("new password not match with confirm password");
            return
        }

        // ajax req
        const formdata = $("#changepass").serialize();
        $.ajax({
            url: "/changepass",
            type: "PUT",
            data: formdata,
            success: function (data) {
                console.log(data);
                if (data.status) {
                    swal(data.message)
                }
            },
            error: function (err) {
                resp = JSON.parse(err.responseText)
                swal(resp.message);
            }
        })
    })
}



//////////////////// report genration
const makeDomUpdate = (data, no) => {
    let table = `<h4>${no} Expence found</h4> <button class="btn btn-primary" id="againform">Reload</button> <table id="datatables-dashboard-projects" class="table mt-5 table-striped my-0 dataTable no-footer">
    <thead>
        <tr role="row">
            <th>Sno.</th>
            <th >email</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
            ${data}
        </tbody>
    </table>`;

    const mainreportel = document.getElementById("mainreport");
    mainreportel.innerHTML = table;

    //// reverse to form
    let againformel = document.getElementById("againform");
    console.log(againformel);
    againformel.addEventListener('click', makeform);
}

const iteratedata = (dataobj) => {
    let maketable = '';
    sno = 0;
    dataobj.map((data, ind) => {
        maketable += ` <tr role="row" class="odd">
            <td>${ind + 1}</td>
            <td>${data.email}</td>
            <td>${data.title}</td>
            <td>
                ${data.cradittype == `cradit` ? `<span class="badge badge-success">+ ${data.amount}</span>` : `<span class="badge badge-danger">- ${data.amount}</span>`};
            </td>
            <td>${data.desc}</td>
            <td>${data.createdAt}</td>
        </tr>`;
        sno = ind;
    });
    makeDomUpdate(maketable, sno + 1);
}


const makeform = () => {
    const form = `<div class="card">
    <div class="card-header">
        <h5 class="card-title">View profile</h5>
    </div>
    <div class="card-body">
        <div class="form-group">
            <label class="form-label">View From</label>
            <input type="date" name="from" id="from"" class=" form-control" placeholder="Select form"
                required>
            </div>
            <div class="form-group">
                <label class="form-label">View to</label>
                <input type="date" name="to" id="to"" class=" form-control" placeholder="Select date"
                    required>
            </div>

            <button type="submit" id="viewreport" class="btn btn-primary">View report</button>
        </div>
    </div>`;
    const mainreportel = document.getElementById("mainreport");
    mainreportel.innerHTML = form;
}


const viewreportel = document.getElementById("viewreport")
if (viewreportel) {
    viewreportel.addEventListener('click', () => {
        from = $("#from").val();
        to = $("#to").val();
        if (from == "")
            swal("select from date")
        else if (to == "")
            swal("select to date");
        else {
            $.ajax({
                url: "/getreport",
                type: "POST",
                data: "from=" + from + "&to=" + to,
                success: function (data) {
                    if (data.status) {
                        console.log(data.expencedata.length);
                        if (data.expencedata.length) {
                            iteratedata(data.expencedata);
                        } else {
                            swal("no expense found");
                        }
                    }
                },
                error: function (err) {
                    console.log(err);
                    // resp = JSON.parse(err.responseText)
                    console.log(err.responseJSON);
                    swal(resp.message);
                }
            })
        }
    })
}



//////////////////////////////////////////////// feedback
const feedbackformel = document.getElementById("feedbackform");
if (feedbackformel) {
    feedbackformel.addEventListener('submit', (e) => {
        e.preventDefault();
        const formdata = $("#feedbackform").serialize();
        $.ajax({
            url: "/feedback",
            type: "POST",
            data: formdata,
            success: function (data) {
                console.log(data);
                $("#feedbackform")[0].reset();
                if (data.status) {
                    swal(data.message)
                }
            },
            error: function (err) {
                resp = JSON.parse(err.responseText)
                swal(resp.message);
            }
        })
    })
}



// editCompany

function editCompany(id) {
    $.ajax({
        url: `/api/getcompanybiyd/${id}`,
        type: "GET",
        success: function ({ data }) {
            $("#ecid").val(data._id);
            $("#ecompanyname").val(data.companyname);
            $("#esalery").val(data.salery);
            $("#ejoindate").val(data.joindate.split("T")[0]);
            $("#edegination").val(data.degination);
            $("#eremark").val(data.remark);
        },
        error: function (err) {
            swal("someting went wrong try again");
        }
    })
}


//updateCompanybtn

function updateEditForm() {
    let ecid = $("#ecid").val();
    let ecompanyname = $("#ecompanyname").val();
    let esalery = $("#esalery").val();
    let ejoindate = $("#ejoindate").val();
    let edegination = $("#edegination").val();
    let eremark = $("#eremark").val();
    var docs = document.getElementById('edocs').files[0];
    if (!ecid) {
        swal("someting went wrong try again");
    } else {
        let form_data = new FormData();
        form_data.append('id', ecid);
        form_data.append('companyname', ecompanyname);
        form_data.append('salery', esalery);
        form_data.append('joindate', ejoindate);
        form_data.append('degination', edegination);
        form_data.append('doc', docs);
        form_data.append('remark', eremark);

        $.ajax({
            url: "/api/addcompany",
            type: 'PUT',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function () {
                $("#updateCompanybtn").prop('disabled', true);
                $('#updateCompanybtn').val('Please Wait....');
            },
            success: function (data) {
                $("#updateCompanybtn").prop('disabled', false);
                $('#updateCompanybtn').val('Add Company');
                if (data.status) {
                    swal(data.message)
                    $("#staticBackdrop").hide();
                    $("#editcompanyForm")[0].reset();
                    setTimeout(() => {
                        window.location.href = "/viewcompany";
                    }, 2000);
                }
            },
            error: function () {
                swal("Something went wrong");
                $("#updateCompanybtn").prop('disabled', false);
                $('#updateCompanybtn').val('Add Company');
            }
        })
    }
}


// AddSaleryButton
function AddSaleryButton(companyid, currsalery) {
    $("#escid").val(companyid);
    $("#currentsalery").val(currsalery);
}

function submitAddSalery() {
    let companyid = $("#escid").val();
    let currsalery = $("#currentsalery").val();
    let recivedamount = $("#recivedamount").val();
    let deduction = $("#deduction").val();
    let remark = $("#remark").val();
    var slip = document.getElementById('slip').files[0];

    if (!companyid) {
        swal("someting went wrong try again");
    } else {
        let form_data = new FormData();
        form_data.append('id', companyid);
        form_data.append('currentsalery', currsalery);
        form_data.append('recivedamount', recivedamount);
        form_data.append('deduction', deduction);
        form_data.append('doc', slip);
        form_data.append('remark', remark);
        $.ajax({
            url: "/api/addsalery",
            type: 'POST',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                if (data.status) {
                    swal(data.message)
                    $("#addSaleryForm")[0].reset();
                    setTimeout(() => {
                        window.location.href = "/viewcompany";
                    }, 2000);
                }
            },
            error: function () {
                swal("Something went wrong");
            }
        })
    }

}

function viewSaleryFunction(id) {
    $.ajax({
        url: `/api/getsalerybyid/${id}`,
        type: "GET",
        success: function ({ data }) {
            console.log(data);
            let totalamt = 0, deductionamt = 0;
            let html = "";
            data.saleryData.forEach((element, ind) => {
                totalamt += element.recivedamount || 0;
                deductionamt += element.deduction || 0;
                html += `
                    <tr id='seldelbtn${ind}'>
                        <th scope="row">${ind + 1}</th>
                        <td>${element.currentsalery}</td>
                        <td>${element.recivedamount}</td>
                        <td>${new Date(element.datetime).toLocaleDateString()}</td>
                        <td>${element.remark}</td>
                        <td>${element.slip != undefined ? "view" : "no slip"}</td>
                        <td>
                        <a href="#" onclick='deleteSlip(${id},${element._id},${ind})' class="btn btn-sm btn-danger">Delete</a>
                        </td>
                    </tr>     
              `;
            });

            $("#viewsalcompname").text(data.companyname);
            $("#totalamt").text(totalamt);
            $("#nosalery").text(data.saleryData.length);
            $("#totaldedection").text(deductionamt);
            $("#tbodysalery").html(html);
        },
        error: function (err) {
            swal("someting went wrong try again");
        }
    })
}


function deleteSlip(id, sid, ind) {
    console.log(id, sid, ind);
    $.ajax({
        url: `/api/addsalery`,
        type: "DELETE",
        data:{id,sid},
        contentType: 'application/json',
        cache: false,
        processData: false,
        success: function ({ data }) {
            console.log(data);
        },
        error: function (err) {
            swal("someting went wrong try again");
        }
    })
}
