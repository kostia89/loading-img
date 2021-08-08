function bytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
        return '0 Byte'
    };
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}



function noop() {};

export function upload(selector, options = {}){
    let input = document.getElementById(selector);
    
    
    let preview = document.createElement('div');
    preview.classList.add("preview");
    let onLoad = options.onLoad ?? noop;

    let files = [];
    
    let upLoad = document.createElement('button')
    upLoad.classList.add("btn", "primari")
    upLoad.innerHTML = 'Load';
    upLoad.style.display = 'none';

    let open = document.createElement('button');
    open.classList.add("btn") ;
    open.innerHTML = 'open';
    if (options.multi){
        input.setAttribute('multiple', true)
    }
    if (options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','))
    }

    input.after(preview);
    input.after(open);
    open.after(upLoad)
    let trigerInput = () => input.click();
    let changeViwe = event => {
        if (!event.target.files.length){
            return 
        }
        preview.innerHTML= '';
        upLoad.style.display = 'inline'
        files = Array.from(event.target.files)
        files.forEach(file => {
            if (!file.type.match('image')){
                return
            }
            let riader = new FileReader()
            riader.onload = ev => {
                let srcImg = ev.target.result
                
                preview.insertAdjacentHTML("afterbegin", `<div class="preview-image">
                <div class="preview-remove" data-name="${file.name}">&times;</div>
                <img src="${srcImg}" alt="${file.name}"/>
                <div class="preview-info">
                <span>${file.name}</span>
                
                ${bytesToSize(file.size)}
                </div>
                </div>`)
               
            }
            riader.readAsDataURL(file)
        });
    }
    let removeImg = event => {
        if (!event.target.dataset.name){
            return
        }
        let {name} = event.target.dataset;
        files = files.filter(file => file.name !== name)
        if (!files.length){
            upLoad.style.display = 'none'
        }
        let bloc = preview.querySelector( `[data-name="${name}"]`)
        .closest('.preview-image')
        
        bloc.classList.add('removing')
        setTimeout(()=> bloc.remove(), 300)
    }

    let cliarPreview = el =>{
       
        el.innerHTML = '<div class="preview-info-progres"></div';
        el.style.bottom = '4px';
    }

    let upLoadImg = () =>{
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove());
        
        let previewInfo = preview.querySelectorAll('.preview-info');
        previewInfo.forEach(cliarPreview)
        
        onLoad(files, previewInfo)
    }

    open.addEventListener('click', trigerInput);
    input.addEventListener('change', changeViwe);
    preview.addEventListener('click', removeImg);
    upLoad.addEventListener('click', upLoadImg)
}