// JavaScript Document
$(window).load(function(){
	$('[data-toggle="tooltip"]').tooltip({
		animated: 'fade',
	});
});
$(document).ready(function(){
	$('input[type="checkbox"]').click(function(){
		if($(this).attr("value")=="newlistmain"){
			$(".newlistmain").toggle(500);
		}  
	});
});
$(document).ready(function(){
	$('input[type="checkbox"]').click(function(){
		if($(this).attr("value")=="newlist1"){
			$(".newlist1").toggle();
			$(".content-lf").toggleClass("contentnew");
		} 
	});
});
$(document).ready(function(){
	$(".collapse_search_filter").click(function(){
		$(".search_filter").slideToggle(200);
		$(".collapse_search_filter i.fa").toggleClass('fa-eye-slash');
	});
});
$(document).ready(function(){
	var oldContainer;
	$(".sortable").sortable({
		group: 'nested',
		afterMove: function (placeholder, container) {
		if(oldContainer != container){
		  if(oldContainer)
			oldContainer.el.removeClass("active")
		  container.el.addClass("active")
		  
		  oldContainer = container
		}
		},
		onDrop: function (item, container, _super) {
		container.el.removeClass("active")
		_super(item)
		}
	});
	
    $(".hover_button .adding").click(function(){
		var parent 		= $(this).attr("data-id");
		var discipline  = $('.search_filter .discipline button.selected').attr('value');

        $("#add_lesson").toggle(200);
		$('#addLesson').find('#parent').val(parent);
		$('#addLesson').find('#discipline').val(discipline);
    });
	
	$("#add_parent").click(function(){
		var parent 		= 0;
		var discipline  = $('.search_filter .discipline button.selected').attr('value');

        $("#add_lesson").toggle(200);
		$('#addLesson').find('#parent').val(parent);
		$('#addLesson').find('#discipline').val(discipline);
    });
	
	$(".hover_button .edit").click(function(){
		var id	= $(this).attr("data-id");

        $("#edit_lesson").toggle(200);
		$('#editLesson').find('#row_id').val(id);
		
		$.post(
            '<?php echo base_url(); ?>index.php/m4_table_of_contents_lesson/get_lesson',
            {
				"id" : id
            },
            function( response ) {
                //do something with data/response returned by server
				$.each(response, function(id1, rec){ 
					//alert( id1 + '=' + rec);
					if(id1 == 'titlu') { $('#edit_lesson').find('#edittitle').val(rec); }
					if(id1 == 'style') {
						if(rec == 'active') { $('#editstyle').prop("checked", true); }
					}
					if(id1 == 'style2') {
						$('#edit_lesson').find('#editstyle2_name').val(rec);
					}
					if(id1 == 'profile') {
						var profile = rec.split(',');
						$('#editLesson').find(':checkbox[name^="editprofile"]').each(function () {
							$(this).prop("checked", ($.inArray($(this).val(), profile) != -1));
						})
					}
					if(id1 == 'official_level') {
						var official_level = rec.split(',');
						$('#editLesson').find(':checkbox[name^="editknowledgelevel"]').each(function () {
							$(this).prop("checked", ($.inArray($(this).val(), official_level) != -1));
						})
					}
				})
            },
            'json'
        );

    });
	
	$(".hover_button .delete").click(function(){
		var id	= $(this).attr("data-id");
		var ok = confirm('Esti sigur ca vrei sa stergi acest capitol/subcapitol ?');
		if(ok) {
			$.post('<?php echo base_url(); ?>index.php/m4_table_of_contents_lesson/delete_lesson', { id: id }, function() {
				window.location.reload();
			});
		}
	});		
	
	$(".close-setting").click(function(){
        $(".hover_setting").hide(200);
    });
	
	$('.search_filter .discipline button ').click(function(){
    	$('.search_filter .discipline button ').removeClass('selected');
    	$(this).addClass('selected');
	});
	$('.search_filter .profile button ').click(function(){
    	$('.search_filter .profile button ').removeClass('selected')
    	$(this).addClass('selected');
	});
	$('.search_filter .level-filter > button ').click(function(){
    	$('.search_filter .level-filter > button ').removeClass('selected')
    	$(this).addClass('selected');
	});
	
	$('.search_filter button').click(function(){
		var discipline  	= $('.search_filter .discipline button.selected').attr('value');
		var profile			= $('.search_filter .profile button.selected').attr('value');
		var knowledgelevel	= $('.search_filter .level-filter button.selected').attr('value');		

		$('#discipline').val(discipline);
		$('#profile').val(profile);
		$('#knowledgelevel').val(knowledgelevel);
		$('#search_filter').submit();
	});
	
	// font family change
	$('.font-family').on('change', function(){
    $('.hover_setting input[type="text"]').css('font-family', $(this).val()); // for textbox
});
});
$(document).on('submit', '#addLesson', function(e) {
		
		e.preventDefault();
		$("#adderror").empty();
        
 		var profile = new Array();
        $("input[name='profile[]']:checked").each(function() {
           profile.push($(this).val());
        });
 		var knowledgelevel = new Array();
        $("input[name='knowledgelevel[]']:checked").each(function() {
           knowledgelevel.push($(this).val());
        });
		
		var parent = $( this).find('#parent' ).val(); //get the id from the line
		var discipline = $( this ).find('#discipline').val();		
		
        $.post(
            $( this ).prop( 'action' ),
            {
                "title": $( this).find('#title' ).val(),
				"style": $( this).find('#style' ).val(),
				"style2": $( this).find('#style2_name' ).val(),					
				"profile": profile,
				"knowledgelevel": knowledgelevel,
				"discipline" : discipline,
				"parent" : parent
            },
            function( response ) {
                //do something with data/response returned by server
				$.each(response, function(idx, rec){									  
					//alert(idx);
					//alert(rec);
					if( idx == "message" ) { 
						$("#adderror").html( rec );
					}
				})

            },
            'json'
        );
 
        //.....
        //do anything else you might want to do
        //.....
        //prevent the form from actually submitting in browser
        return false;
});

$(document).on('submit', '#editLesson', function(e) {

		e.preventDefault();
		$("#editerror").empty();
        
 		var profile = new Array();
        $("input[name='editprofile[]']:checked").each(function() {
           profile.push($(this).val());
        });
 		var knowledgelevel = new Array();
        $("input[name='editknowledgelevel[]']:checked").each(function() {
           knowledgelevel.push($(this).val());
        });
		
		var editstyle = $( this).find('#editstyle' ).is(":checked") ? 'active' : 'inactive';
		
		var id = $( this).find('#row_id' ).val(); //get the id from the line
		
        $.post(
            $( this ).prop( 'action' ),
            {
                "edittitle": $( this).find('#edittitle').val(),
				"editstyle": editstyle,
                "editstyle2": $( this).find('#editstyle2_name').val(),				
				"editprofile": profile,
				"editknowledgelevel": knowledgelevel,
				"id": id
            },
            function( response ) {
                //do something with data/response returned by server
				$.each(response, function(idx, rec){									  
					$("#editerror").append('<li class="error">'+rec+'</li>').slideDown('slow');
				})

            },
            'json'
        );
 
        //.....
        //do anything else you might want to do
        //.....
        //prevent the form from actually submitting in browser

        return false;
});