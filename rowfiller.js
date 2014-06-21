//<script>

/* Assumptions
//      - Items only have other item siblings
//      - Concept of rows, columns and items
//          - a row is a set of columns with the same offset top
//          - a column contains one or more items
//          - an item is a page element which can be moved elsewhere in a page and still retain it's look and feel

Browser Testing
    If a browser isn't mentioned it has yet to be tested
Works:
    Chrome 31
    Firefox 26
    Safari 7
    Safari iOS 7
    IE 7, 8, 9, 10



*/
(function($) {
    
    'use strict';
    
    var run
        ,delay = 250
        ,dataOptionsName = 'fillRowHeightsOptions'
		,minHeightSupportedNot = document.documentElement.style.minHeight === undefined
    ;    
    run = function(o) {
    	
//console.log('run');
    	
    	
    	var $this = $(this)
    		,colLevel
    		,itemLevel
    		,colToItemLevels
    		,colSelector = ''
    		,colToItemSelector = ''

    		,processRow
    		,i
        ;
        
    	o = $this.data(dataOptionsName) || {};
    	colLevel = $this.data('fillrowheights-col-level') || o.colLevel || 1;
    	itemLevel = $this.data('fillrowheights-item-level') || o.itemLevel || 2;
    	colToItemLevels = itemLevel - colLevel;
    	colSelector = '';
    	colToItemSelector = '';
    
    
        // Set the selectors
        for (i = 0; i < colLevel; i += 1) {
            colSelector += ' > *';
        }
        for (i = 0; i < colToItemLevels; i += 1) {
            colToItemSelector += ' > *';
        }
    
    		
    	processRow = function($cols) {

//console.log('processRow');
    		
    		var currentTallest = 0;
    		
    		$cols.each(function() {
    		
    			var $col = $(this)
    			    ,$item = $col
    			    ,colOffsetTop
    			    ,itemOffsetTop
    			    ,offsetDifference
    			    ,height
    			;
    			
    			if (colToItemSelector !== '') {
                    $item = $col.find(colToItemSelector).last();	
    			}
    			
    			// Reset the height
			    if (minHeightSupportedNot) {
        			$item.css('height', 'auto');
			    }
    			$item.css('minHeight', 0);
    			
			    colOffsetTop = $col.offset().top;
			    itemOffsetTop = $item.offset().top;
			    offsetDifference = itemOffsetTop - colOffsetTop;
			    // outerHeight to account for content, padding and border, but not margin
			    height = offsetDifference + $item.outerHeight();
			    
// console.log($item[0]);
// console.log(i + ' = ' + itemOffsetTop + ' ' + colOffsetTop + ' ' + height);
    			
    			if (height > currentTallest) {
    				currentTallest = height;
    			}
    			
    		});

    		$cols.each(function() {
    		
    			var $col = $(this)
    			    ,$item = $col
    			    ,itemOffsetTop
    			    ,colOffsetTop
    			    ,offsetDifference
    			    ,height
    			    ,heightDifference
    			    ,heightAnyBox
			    ;
    			
    			if (colToItemSelector !== '') {
                    $item = $col.find(colToItemSelector).last();	
    			}
			    
			    colOffsetTop = $col.offset().top;
			    itemOffsetTop = $item.offset().top;
			    offsetDifference = itemOffsetTop - colOffsetTop;
			    height = offsetDifference + $item.outerHeight();
        		heightAnyBox = parseInt($item.css('height'), 10);

        		if (currentTallest > height) {
        		
        		    heightDifference = currentTallest - height;
        		    
        			if (minHeightSupportedNot) {
            			$item.css('height', heightAnyBox + heightDifference + 'px');
        			}
        			$item.css('minHeight', heightAnyBox + heightDifference + 'px');
        			
        		}
    			
    		});
    		
    	};
    	
    	$this.each(function() {
    		
    		var $cols = $(this).find(colSelector)
    			,currentPositionTop = -1
    			,rows = []
    		;

    		// Check if there are any children
    		if ($cols.length) {
    			
				$cols.each(function() {
					var $col = $(this);
					if ($col.position().top > currentPositionTop) {
						if (rows.length > 0) {
							// Do row
							processRow(rows[rows.length - 1]);
						}
						currentPositionTop = $col.position().top;
						rows[rows.length] = $();
					}
					rows[rows.length - 1] = rows[rows.length - 1].add($col);
				});
				
				// Do row
				processRow(rows[rows.length - 1]);
    						
    		}
    		
    		
    	});
    	return this;
    };

    
    $.fn.fillRowHeights = function(o) {
	
    	o = o || {};
    	
		delay = o.delay || delay;
    	
    	// $collection, to collect all the elements that can passed into imagefill so they can be updated on window.resize efficiently
        var $collection = $()
        	,timeoutID
        	,runBuffer
        ;
    	
    	// Prevent unnecessary calls to run
    	runBuffer = function() {
    		clearTimeout(timeoutID);
    		timeoutID = setTimeout(function() {
    			$collection.each(run);
    		}, delay);
    	};
    	
    	$(window).on('resize', runBuffer);
    	
    	this.each(function() {
    	    $(this).data(dataOptionsName, o);
			$collection = $collection.add(this);
    	});
    	
    	return this.each(run);
    	
    };
    
}(jQuery));

// http://stackoverflow.com/questions/5653788/is-there-a-way-to-introduce-internet-explorer-conditional-comments-using-javascr

var s = document.createComment('[if IE 6]><script>var thisISIE6 = true;</script><![endif]')
    d = document.createElement('script')
    ,s1 = document.getElementsByTagName('script')[0]
    ,h1 = document.getElementsByTagName('head')[0]
;
s1.parentNode.insertBefore(s, s1);
s1.parentNode.insertBefore(d, s1);

alert(typeof thisISIE6 == 'undefined' ? false : true);

//document.getElementsByTagName('script')[0].style.minHeight = 100;
//alert(document.getElementsByTagName('script')[0].style.minHeight);


$(function() {

    $('.fillrowheights').fillRowHeights({itemLevel:3});
    
    
    

    
});



