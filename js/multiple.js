/*-- MPI Jquery Script
-------------------------------------------------------*/

//validate upload plugin and check ZIP
function check_valid_zipfile(dpwap_eleId){ 
	var	extension = ".zip";
	var inp = document.getElementById(dpwap_eleId);
    var count = inp.files.length;
    for(var a=0; a < count; a++){
		var fieldvalue = inp.files.item(a).name;
		var thisext = fieldvalue.substr(fieldvalue.lastIndexOf('.'));
		if(thisext == extension){ 
		return true; 
		}
    }

	alert("Please upload vaild .zip extension file.");
	return false;
}

//all plugins form submit  function
function activateAllPLugins(){ 
	document.getElementById('form_alldpwap').submit();
}

//single plugin activated function
jQuery(document).ready(function() {
    jQuery('.dpwap_inner a').click(function() {
    	 var that = this;
    	 var dpwapUrl = jQuery(this). attr("href");
        
    	 var dpwapUrl2 = decodeURIComponent(dpwapUrl).split("&");
    	 var dpwapUrl3= dpwapUrl2[1].split('=');
    	 jQuery.ajax({
            url    : ajaxurl,
            type : 'post',
            data : {
                action : 'dpwap_plugin_activate',
                dpwap_url : dpwapUrl3[1]
            },
            success : function( response ) {
            	alert("Plugin activated successfully");
            	jQuery(that).replaceWith('<h4>Plugin activated</h4>');
            }
        }); 
         return false;
    });

  //feature poup second section activated function
   jQuery('#next_first').click(function() {
       jQuery('#dpwap_section_first').hide();
       jQuery("#dpwap_section_second").show();
   });

//feature poup third(suggest theme and plugins) section activated function
   jQuery('#next_second').click(function() {
    if (jQuery('input[name="feature"]').is(':checked')) {
       
       jQuery("#dpwap_section_first").hide();
       jQuery('#dpwap_section_second').hide();
       jQuery("#dpwap_section_third").show();

            var wpdapFeature = [];
            jQuery.each(jQuery("input[name='feature']:checked"), function(){            
            wpdapFeature.push(jQuery(this).val());
            });
             jQuery.ajax({
            url    : ajaxurl,
            type : 'post',
            data : {
                action : 'dpwap_feature_select',
                dpwap_feature : wpdapFeature
            },
             beforeSend: function() {
                jQuery('#thirdLoading').text('Please wait...');
            },
            success : function( response ) {
                 jQuery('#thirdLoading').hide();
                jQuery('#title_third').text('You are all set! Install and activate our following plugins from wordpress.org to add selected features.');
                jQuery("#dpwap_third_inner").html(response); 
            }
        });
        }else { alert("Select at least one Feature "); return false; }   
        });
//feature poup back button click function
       jQuery('#back_second').click(function() {
         jQuery("#dpwap_section_first").hide();
         jQuery('#dpwap_section_second').show();
         jQuery("#dpwap_section_third").hide();
       });

 var count_checked = 0;
//sk admin onclick top apply button multiple plugin download
    jQuery( document ).on( 'click', '#doaction', function() { 

       var getAction=jQuery('#bulk-action-selector-top').val();
       var count_checked = jQuery("[name='checked[]']:checked").length;

        if (getAction=='all_download' && count_checked==0){
             jQuery("#no-items-selected").hide();
             alert('Please select a plugin (or multiple plugins) to begin download.');
            return false;
          }else{
           //var counter=0;
           if(getAction == "all_download"){
            jQuery("#dpwapLoader").show();
             setTimeout(function(){
            jQuery("[name='checked[]']:checked").each(function () {
                var plgname= jQuery(this).val();
                dpwap_recursively_download(count_checked,plgname);
            });
          }, 500); 
          
         return false;
           }
        }
     });
    
    //sk admin onclick bottom apply button multiple plugin download
        jQuery( document ).on( 'click', '#doaction2', function() { 

       var getAction=jQuery('#bulk-action-selector-bottom').val();
       var count_checked = jQuery("[name='checked[]']:checked").length;

        if (getAction=='all_download' && count_checked==0){
             jQuery("#no-items-selected").hide();
             alert('Please select a plugin (or multiple plugins) to begin download.');
            return false;
          }else{
           //var counter=0;
           if(getAction == "all_download"){
            jQuery("#dpwapLoader").show();
            jQuery("[name='checked[]']:checked").each(function () {
              var plgname= jQuery(this).val();
              setTimeout(function(){
                dpwap_recursively_download(count_checked,plgname);
                 }, 3000); 
            });
         
          
         return false;
           }
        }
     });

    var getUpdate = jQuery(".update-nag").attr('class');
    if(getUpdate=='update-nag'){ 
      jQuery("#btn_upload").css("margin-top", "74px");
      }else{ 
       jQuery("#btn_upload").css("margin-top", "9px"); 
      }


if(jQuery("#activate_yes").length!=0){
     jQuery(".dpwap_allactive").show();
}


});



//feature poup form submit function
function activateFeaturePLugins(){ 
    document.getElementById('dpwapActivate').submit();
}


var prev_count = 0;
 function dpwap_recursively_download(count_checked,plgname)
{
  // alert(plgname);
 var pass_data=count_checked;
         var chartMenu=plgname;
         jQuery.ajax({
            type:"POST",
            async:false, // set async false to wait for previous response
            url: ajaxurl,
            dataType:"json",
            data : {
                   action : 'dpwap_plugin_download_url',
                   pluginData : chartMenu,
                   plugin_count : prev_count+1
               },
                complete: function() {
                  prev_count++;
                 if(prev_count < pass_data){
                    //recursively_ajax();
                    
                  }else{
                    window.location.href ="plugins.php?action=multiple_download";
                    //alert('AllZip Created successfully');
                  }   

                },
            success: function(data)
            {
                // prev_count++;
                if(prev_count < pass_data){
                    //recursively_ajax();
                }
            }
    });
}
