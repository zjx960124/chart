document.ready(function () {
  // chrome 浏览器直接加上下面这个样式就行了，但是ff不识别
  document.getElementsByTagName('body')[0].css('zoom', 'reset');
  document.addEventListener('keydown', function (event) {
    //event.metaKey mac的command键
    if ((event.ctrlKey === true || event.metaKey === true)&& (event.which === 61 || event.which === 107 || event.which === 173 || event.which === 109 || event.which === 187  || event.which === 189)){
      event.preventDefault();
    }
  });
  document.addEventListener('mousewheel', function (event) {
    if (event.ctrlKey === true || event.metaKey) {
      event.preventDefault();
    }
  });
});
