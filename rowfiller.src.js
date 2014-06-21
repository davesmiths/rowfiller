/* github.com/davesmiths/rowfiller */

(function($) {
    
    'use strict';
    
    var run
        ,delay = 250
        ,dataOptionsName = 'rowfillerOptions'
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
    	colLevel = $this.data('rowfiller-col-level') || o.colLevel || 1;
    	itemLevel = $this.data('rowfiller-item-level') || o.itemLevel || 2;
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

    
    $.fn.rowfiller = function(o) {
	
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

