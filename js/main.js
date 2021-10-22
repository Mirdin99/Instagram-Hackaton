// Назанчение переменных 

let API = 'http://localhost:8000/instagram'
let btnAdd = $('.btn-add');
let inpName = $('.name-modal');
let inpImg = $('.img-modal');
let inpOpis = $('.opis-modal');
let btnCloseModal = $('.btnClose-modal');
let btnAddPost = $('.btn-addPost');
let btnSearch = $('.btn-search');
let inpSearch = $('.search')
let postContainer = $('.post-container');
let page = 1;
let pageCount = 1;
let countLike = 0;
let countComment = 0;
let countView = 0;


// Событие на клик Добавить, для открытия модального окна

btnAdd.on('click', function () {
    $('.modal-post').css('display', 'block')
})

// Событие на клик ADD, отправка данных в localhost 


btnAddPost.on('click', function (e) {
    e.preventDefault()
    if (!inpName.val().trim() || !inpImg.val().trim() || !inpOpis.val().trim()) {
        alert('Заполните все поля!')
        return
    }
    let newPost = {
        name: inpName.val(),
        image: inpImg.val(),
        opisanie: inpOpis.val()
    }
    postNewPost(newPost)
    inpName.val('')
    inpImg.val('')
    inpOpis.val('')

    $('.modal-post').css('display', 'none')
})

function postNewPost(newPost) {
    fetch(API, {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
}

btnCloseModal.on('click', function () {
    $('.modal-post').css('display', 'none')
})


// Функция для отображенния Постов, которые будем получать из localhost

async function render() {
    let res = await fetch(`${API}?_limit=2&_page=${page}`)
    let data = await res.json()
    postContainer.html('')
    data.forEach((item, i) => {
        postContainer.append(`
        <div class="post-item" id="${item.id}">
        <img src=${item.image} alt="${item.name}" class="postItemImg">
        </div>
        <div class="reactions" id="${item.id}">
            <img src="https://www.pinclipart.com/picdir/big/164-1646319_microsoft-clipart-online.png" class="edit" id="icon">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Delete-button.svg/862px-Delete-button.svg.png" class="delete" id="icon">
        </div>
        `)
    })
}

// События на клики лайк, коммент, просмотры

$('body').on('click', '.like', function () {
    countLike += 1
    render()
})

$('body').on('click', '.postItemImg', function () {
    $('.modal-postBackground').css('display', 'block')
    postInfo()
})

async function postInfo() {
    let res = await fetch(API)
    let data = await res.json()
    $('.modal-postInfo').html('')
    data.forEach(item => {
        $('.modal-postInfo').html(`
        <button class="btnClose-modal">X</button>
            <div class="modal-left">
                <img src=${item.image} alt="${item.name}" class="postInfoImg">
            </div>
                <div class="modal-right">
                    <div class="opisInfo">
                    <p class="opisInfo">${item.opisanie}</p>
                    </div>
                    <div class="commentInfo">
                        <input type="text" class="commentInp">
                    </div>
                    <div class="iconInfo">
                        <table>
                            <tr>
                                <td>
                                    <img src="https://play-lh.googleusercontent.com/6Ary86oQx3irIDgH-iT-jOXxdFmsx2mdR9LkOqknoCbZzGNTCUPIyZD9c92htPzCJw" class="like" id="icon">
                                </td>
                                <td>
                                    <img src="https://icons.veryicon.com/png/o/hardware/jackdizhu_pc/comment-25.png" class="comments" id="icon">
                                </td>
                                <td>
                                    <img src="http://s1.iconbird.com/ico/2013/9/452/w514h3201380476829eye.png" class="view" id="icon">
                                </td>
                            </tr>
                            
                            <tr>
                                <td>
                                    ${countLike}
                                </td>
                                <td>
                                    2
                                </td>
                                <td>
                                    3
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                `)
    })
}

// x modal

$('body').on('click','.btnClose-modal',()=>$('.modal-postBackground').css('display', 'none'))

//Событие на клик Search, для того чтобы найти данные 

btnSearch.on('click',function(e){
    e.preventDefault();
    if (!inpSearch.val().trim()) {
        alert('Заполните все поля!')
        return
    }
    searchData()
    inpSearch.val('')
})

// Функция для поиска данных в Localhost

async function searchData(){
    let res = await fetch(`${API}?q=${inpSearch.val()}`)
    let data = await res.json()
    postContainer.html('')
    data.forEach((item, i) => {
        postContainer.append(`
        <div class="post-item" id="${item.id}">
        <img src=${item.image} alt="${item.name}" class="postItemImg">
        <div class="reactions" id="${item.id}">
            <img src="https://www.pinclipart.com/picdir/big/164-1646319_microsoft-clipart-online.png" class="edit" id="icon">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Delete-button.svg/862px-Delete-button.svg.png" class="delete" id="icon">
        </div>
        </div>
        `)
    })
}

// События на кнопки prev и next, для того чтобы перелистывать страницы  

fetch(API)
    .then(res => res.json())
    .then(data=>{
    pageCount = Math.ceil(data.length/2)
})

$('.next-btn').on('click',function(){
    if( page >= pageCount ) return
    page++
    render()
})

$('.previous-btn').on('click',function(){
    if(page <= 1) return
    page--
    render()
})

// Событие на клик Edit, для того чтобы редактировать данные в localhost

$('body').on('click', '.edit', function(event) {
    $('.modal-postEdit').css('display','block')
    let id = event.target.parentNode.id
    fetch(`${API}/${id}`)
        .then(resModal => resModal.json())
        .then(dataModal=>{
              $('.name-modal').val(dataModal.name)
              $('.opis-modal').val(dataModal.opisanie)
        }
        )
        $('.modal-postEdit').attr('id',id)
})

  // Событие на клик Save, для того чтобы сохранить данные в модальном окне 

  $('.btn-editPost').on('click',function(){
    let obj = {
        name:  $('.name-modal').val(),
        opisanie: $('.opis-modal').val()
    }
      let id = $('.btn-editPost').attr('id')
    fetch(`${API}/${id}`,{
        method: 'PATCH',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
    }})
    .then(()=>render())
    $('.modal-postEdit').css('display','none')
})

$('.btnClose-modal').on('click',function(){
  $('.modal-postEdit').css('display','none')
})

// Событие на кнопку Delete, для того чтобы удалить данные из localhost

$('body').on('click', '.delete', function(event) {
    let id = event.target.parentNode.id
    fetch(`${API}/${id}`, {
        method: 'DELETE'
      })
      .then(() => render())
  })

render()