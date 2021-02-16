const others = {
    /**
     * 根据文件名称获取文件后缀名
     * @param fileName 文件名称
     * @param fileStyle 图片形状
     */
    getFileLogo:(fileName="1.xxx",fileStyle="s")=>{
        const extName = fileName.split('.').slice(-1)[0].toLowerCase();
        if (extName == 'doc'|| extName == 'docx') {
            return fileStyle+"word"
        } else if (extName == 'xls'|| extName == 'xlsx') {
            return fileStyle+"xls"
        } else if (extName == 'zip') {
            return fileStyle+"zip"
        } else if (extName == 'rar') {
            return fileStyle+"rar"
        } else if (extName == 'pdf') {
            return fileStyle+"pdf"
        } else if (extName == 'png') {
            return fileStyle+"png"
        } else if (extName == 'jpg'||extName == 'jpeg') {
            return fileStyle+"jpg"
        } else if (extName == 'gif') {
            return fileStyle+"gif"
        } else if (extName == 'ppt' || extName == 'pptx') {
            return fileStyle+"ppt"
        } else if (extName == 'txt') {
            return fileStyle+"txt"
        } else {
            return fileStyle+"unknown"
        }
    },
    translateHtmlCharater: (html="") => {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent;
    },
}
export default others
