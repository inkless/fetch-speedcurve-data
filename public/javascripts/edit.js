(function() {
  $('button').on('click', function() {
    var data = $('textarea').val().trim().split('\n');
    $.ajax({
      type: 'POST',
      url: '/edit/save',
      data: { data },
      dataType: 'json',
      success: function() {
        console.log('edit done');
      }
    });
  });
})();

