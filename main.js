//Tạo ra table 
import { SanPham } from './Models/SanPham.js';
import { DanhSachSanPham } from './Models/DanhSachSanPham.js';
let dsSanPham = new DanhSachSanPham();


const renderTable = () => {
    let contentTable = `
    <div class="card text-white bg-dark">
        <div class="card-body">
        <h4 class="card-title">Danh sách sản phẩm</h4>
            <div class='container'>
                <div class="row">
                    <div class="col-md-3">
                        <input id="maSP" class="form-control" placeholder="Mã SP" />
                    </div>
                    <div class="col-md-3">
                        <input id="tenSP" class="form-control" placeholder="Tên SP" />
                    </div>
                    <div class="col-md-3">
                        <input id="gia" class="form-control"  placeholder="Giá"/>
                    </div>
                    <div class="col-md-3">
                        <input id="hinhAnh" class="form-control" placeholder="Link hình" />
                    </div>
                </div>
                <br />
                <button class="btn btn-success" id="btnThemSanPham" >Thêm sản phẩm</button>
            </div>
        </div>
    </div>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>Mã SP</th>
                    <th>Tên SP</th>
                    <th>Giá </th>
                    <th>Hình ảnh</th>
                    <th></th>
                </tr>
            </thead>
        <tbody id="tblDanhSachSanPham">
           
        </tbody>
        </table>
    </div>
    `;
    document.getElementById('root').innerHTML += contentTable;
}

//render ra Table
renderTable();

//Đọc file json hoặc gọi api 
axios({
    method: 'get', //method là phương thức get, post hoặc put delete
    url: './assets/data.json' // Đường dẫn đến file json, xml hoặc là link api backend cung cấp
}).then((result) => { //Hàm thực thi khi gọi ajax thành công
    //Kết quả trả về có dạng là result.data
    result.data.map(el => {
        let sanPham = new SanPham(el.maSP, el.tenSP, el.gia, el.hinhAnh);
        dsSanPham.dssp.push(sanPham);
    });
    luuStorage(dsSanPham.dssp);
    //Dom đến tbody gán innerHTML vào
    renderTRSanPham(dsSanPham.dssp);
}).catch((error) => {
    console.log(error); //Tên lỗi khi gọi api không thành công
});


document.getElementById('btnThemSanPham').onclick = function() {

    let checkButton = document.getElementById('btnThemSanPham').innerHTML;
    if (checkButton === "Thêm sản phẩm") {

        // lấy danh sách sản phẩm từ Storage
        dsSanPham.dssp = layStorage();
        let _maSp = document.getElementById('maSP').value;
        let _tenSp = document.getElementById('tenSP').value;
        let _gia = document.getElementById('gia').value;
        let _link = document.getElementById('hinhAnh').value;

        let sanPham = new SanPham(_maSp, _tenSp, _gia, _link);

        if (_maSp == "") {
            alert("Vui lòng ko để trống Mã sản phẩm");
            return;
        }

        // Kiểm tra trùng
        let check = dsSanPham.dssp.filter(el =>
            el.maSP === _maSp
        );

        if (check.length != 0) {
            alert("Vui lòng ko nhập trùng Ma san pham");
            return;
        }

        // thêm sản phẩm vào dsSanPham
        dsSanPham.themMotSanPham(sanPham);
        // lưu vào Strorage
        luuStorage(dsSanPham.dssp);
        // Render lại table sản phẩm
        renderTRSanPham(dsSanPham.dssp);
        // clear text
        clearText();
    }
    //Th Chỉnh sửa thông tin
    else {
        document.getElementById('btnThemSanPham').innerHTML = "Thêm sản phẩm";
        document.getElementById('maSP').removeAttribute("disabled");


        let _maSP = document.getElementById('maSP').value;
        let _tenSP = document.getElementById('tenSP').value;
        let _gia = document.getElementById('gia').value;
        let _hinhAnh = document.getElementById('hinhAnh').value;

        let sanPham = new SanPham(_maSP, _tenSP, _gia, _hinhAnh);

        dsSanPham = new DanhSachSanPham();
        dsSanPham.dssp = layStorage();


        dsSanPham.dssp = dsSanPham.dssp.map(el => {

            if (el.maSP === _maSP) {

                el = sanPham;
            }
            return el;

        });

        // lưu strorage
        luuStorage(dsSanPham.dssp);
        //renderlaiTable
        renderTRSanPham(dsSanPham.dssp);

        //clear Text
        clearText();

    }
}

function clearText() {
    document.getElementById('maSP').value = "";
    document.getElementById('tenSP').value = "";
    document.getElementById('gia').value = "";
    document.getElementById('hinhAnh').value = "";
}

function renderTRSanPham(dssp) {
    let content = '';
    content = dssp.reduce((trContent, sp, index) => {
        trContent = trContent + `
                <tr>
                 <td>${sp.maSP}</td>
                 <td>${sp.tenSP}</td>
                 <td>${sp.gia}</td>
                 <td><img src="${sp.hinhAnh}" width="50" height="50" /></td>
                 <td><button class="btn btn-dark" onclick="editInfo('${sp.maSP}')" >Chỉnh sửa</button>
                    <button class="btn btn-danger" onclick="deleteInfo('${sp.maSP}')">Xóa</button></td>
                </tr>
            `;
        return trContent;
    }, '');

    document.getElementById('tblDanhSachSanPham').innerHTML = content;


}

function luuStorage(danhSachSp) {
    localStorage.setItem('DanhSachSanPham', JSON.stringify(danhSachSp));
}

function layStorage() {
    let dssp = [];
    if (localStorage.getItem('DanhSachSanPham')) {
        dssp = JSON.parse(localStorage.getItem('DanhSachSanPham'));
    }
    return dssp;
}


window.editInfo = function editInfo(maSp) {
    dsSanPham = layStorage();


    // duyệt mảng dsSanPham lấy phần tử có  el.MaSp=maSp 
    let sanPham = dsSanPham.filter(el =>
        el.maSP === maSp
    )[0];


    document.getElementById('maSP').value = sanPham.maSP;
    document.getElementById('tenSP').value = sanPham.tenSP;
    document.getElementById('gia').value = sanPham.gia;
    document.getElementById('hinhAnh').value = sanPham.hinhAnh;


    document.getElementById('btnThemSanPham').innerHTML = "Chỉnh sửa thông tin";
    document.getElementById('maSP').setAttribute("disabled", "disabled");


}

window.deleteInfo = function deleteInfo(maSp) {
    dsSanPham.dssp = layStorage();

    // tìm ra item cần delete
    let itemDelete = dsSanPham.dssp.filter(el =>
        el.maSP === maSp
    )[0];

    dsSanPham.dssp.splice(dsSanPham.dssp.indexOf(itemDelete), 1);

    // luu storage
    luuStorage(dsSanPham.dssp);
    // render lại table
    renderTRSanPham(dsSanPham.dssp);

    // đề phòng TH bấm chỉnh sửa rồi bấm xóa
    document.getElementById('maSP').removeAttribute('disabled');
    clearText();
}







//  npm[ten thu vien]: lenh tai thu vien
//  package.json: là file tổng hợp các thư viện cài cho project
// npm install : là lệnh dựa vào package.json sẽ cài lại toàn bộ thư viện cho project thông
// qua thuộc dependencies