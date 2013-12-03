
/*
Tipue Image Search 3.1
Copyright (c) 2013 Tipue
Tipue Search is released under the MIT License
http://www.tipue.com/search
*/ 


(function($) {

     $.fn.tipuesearch = function(options) {

          var set = $.extend( {
          
               'show'                   : 20,
               'newWindow'              : false,
               'minimumLength'          : 3,
               'imageHeight'            : 150
          
          }, options);
          
          return this.each(function() {

               var tipuesearch_in = {
                    pages: []
               };
               tipuesearch_in = $.extend({}, tipuesearch);                              
               
               var tipue_search_w = '';
               if (set.newWindow)
               {
                    tipue_search_w = ' target="_blank"';      
               }

               function getURLP(name)
               {
                    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
               }
               if (getURLP('q'))
               {
                    $('#tipue_search_input').val(getURLP('q'));
                    getTipueSearch(0);
               }               
                             
               $('#tipue_search_button').click(function()
               {
                    getTipueSearch(0);
               });
               $(this).keyup(function(event)
               {
                    if(event.keyCode == '13')
                    {
                         getTipueSearch(0);
                    }
               });

               function getTipueSearch(start)
               {
                    $('#tipue_search_content').hide();
                    var out = '';
                    var show_stop = false;
                    
                    var d = $('#tipue_search_input').val().toLowerCase();
                    d = $.trim(d);
                    var d_w = d.split(' ');
                    d = '';
                    for (var i = 0; i < d_w.length; i++)
                    {
                         var a_w = true;
                         for (var f = 0; f < tipuesearch_stop_words.length; f++)
                         {
                              if (d_w[i] == tipuesearch_stop_words[f])
                              {
                                   a_w = false;
                                   show_stop = true;          
                              }
                         }
                         if (a_w)
                         {
                              d = d + ' ' + d_w[i];
                         }
                    }
                    d = $.trim(d);
                    d_w = d.split(' ');
                    
                    if (d.length >= set.minimumLength)
                    {

                         var d_r = d;
                         for (var i = 0; i < d_w.length; i++)
                         {
                              for (var f = 0; f < tipuesearch_replace.words.length; f++)
                              {
                                   if (d_w[i] == tipuesearch_replace.words[f].word)
                                   {
                                        d = d.replace(d_w[i], tipuesearch_replace.words[f].replace_with);
                                   }
                              }
                         }
                         d_w = d.split(' ');
                         
                         var d_t = d;
                         for (var i = 0; i < d_w.length; i++)
                         {
                              for (var f = 0; f < tipuesearch_stem.words.length; f++)
                              {
                                   if (d_w[i] == tipuesearch_stem.words[f].word)
                                   {
                                        d_t = d_t + ' ' + tipuesearch_stem.words[f].stem;
                                   }
                              }
                         }
                         d_w = d_t.split(' ');

                         var c = 0;
                         found = new Array();
                         for (var i = 0; i < tipuesearch_in.pages.length; i++)
                         {
                              var score = 1000000000;
                              for (var f = 0; f < d_w.length; f++)
                              {
                                   var pat = new RegExp(d_w[f], 'i');
                                   if (tipuesearch_in.pages[i].title.search(pat) != -1)
                                   {
                                        score -= (200000 - i);
                                   }
                                   if (tipuesearch_in.pages[i].text.search(pat) != -1)
                                   {
                                        score -= (150000 - i);
                                   }
                                   if (tipuesearch_in.pages[i].image.search(pat) != -1)
                                   {
                                        score -= (100000 - i);
                                   }
                              }
                              if (score < 1000000000)
                              {
                                   found[c++] = score + '^' + tipuesearch_in.pages[i].title + '^' + tipuesearch_in.pages[i].image + '^' + tipuesearch_in.pages[i].width + '^' + tipuesearch_in.pages[i].height + '^' + tipuesearch_in.pages[i].loc;                                                                   
                              }
                         }                         
                         
                         if (c != 0)
                         {
                              out += '<div id="tipue_search_container">';
                                  
                              found.sort();
                              var l_o = 0;
                              for (var i = 0; i < found.length; i++)
                              {
                                   var fo = found[i].split('^');
                                   if (l_o >= start && l_o < set.show + start)
                                   {
                                        out += '<div class="tipue_search_image_wrap">';
                                        out += '<img class="tipue_search_image" id="box' + l_o + '" style="height: ' + set.imageHeight + 'px;" src="' + fo[2] + '">';
                                        out += '</div>';
                                        out += '<div class="tipue_search_box_clear" id="clear_box' + l_o + '"></div>';
                                        out += '<div class="tipue_search_box" id="show_box' + l_o + '">';
                                        out += '<div class="tipue_search_box_close" id="close_box' + l_o + '"></div>';
                                        out += '<div><a href="' + fo[5] + '"' + tipue_search_w + '><img class="tipue_search_box_image" src="' + fo[2] + '"></a></div>';
                                        out += '<div class="tipue_search_box_title"><a href="' + fo[5] + '"' + tipue_search_w + '>' +  fo[1] + '</a></div>';
                                        out += '<div class="tipue_search_box_loc"><a href="' + fo[5] + '"' + tipue_search_w + '>' +  fo[5] + '</a> &nbsp;' + fo[3] + ' x ' + fo[4] + '</div>';
                                        out += '<div class="tipue_search_box_btn_wrap"><div style="float: left; margin-right: 13px;"><a class="tipue_search_btn" href="' + fo[5] + '"' + tipue_search_w + '>Go to page</a></div>';
                                        out += '<div style="float: left;"><a class="tipue_search_btn" href="' + fo[2] + '"' + tipue_search_w + '>Full size</a></div><div style="clear: both;"></div></div>';
                                        out += '</div>';
                                   }
                                   l_o++;     
                              }
                              out += '<div style="clear: both;"></div>';
                              
                              if (c > set.show)
                              {
                                   var pages = Math.ceil(c / set.show);
                                   var page = (start / set.show);
                                   
                                   if (start > 0)
                                   {
                                       out += '<a href="javascript:void(0)" class="tipue_search_more" id="' + (start - set.show) + '">Prev</a>';
                                   }                                  
                                   
                                   if (page + 1 != pages)
                                   {
                                       out += '<a href="javascript:void(0)" class="tipue_search_more" id="' + (start + set.show) + '">More</a>'; 
                                   }
                              }
                              out += '</div>';
                         }
                         else
                         {
                              out += '<div id="tipue_search_warning_head">Nothing found</div>'; 
                         }
                    }
                    else
                    {
                         if (show_stop)
                         {
                              out += '<div id="tipue_search_warning_head">Nothing found</div><div id="tipue_search_warning">Common words are largely ignored</div>';     
                         }
                         else
                         {
                              out += '<div id="tipue_search_warning_head">Search too short</div>';
                              if (set.minimumLength == 1)
                              {
                                   out += '<div id="tipue_search_warning">Should be one character or more</div>';
                              }
                              else
                              {
                                   out += '<div id="tipue_search_warning">Should be ' + set.minimumLength + ' characters or more</div>';
                              }
                         }
                    }
               
                    $('#tipue_search_content').html(out);
                    $('#tipue_search_content').slideDown(200);

                    $('.tipue_search_image').click(function()
                    {
                         var id_v = $(this).attr('id');
                         var t_1 = '#clear_' + id_v;
                         var t_2 = '#show_' + id_v;
                         $(t_1).show();
                         $(t_2).slideDown(300);
                    });

                    $('.tipue_search_box_close').click(function()
                    {
                         var id_v = $(this).attr('id');
                         var t_1 = id_v.substr(9);
                         var t_2 = '#clear_box' + t_1;
                         var t_3 = '#show_box' + t_1;
                         $(t_2).hide();
                         $(t_3).hide();
                    });

                    $('.tipue_search_more').click(function()
                    {
                         var id_v = $(this).attr('id');
                         getTipueSearch(parseInt(id_v));
                    });                           
               }          
          
          });
     };
   
})(jQuery);




