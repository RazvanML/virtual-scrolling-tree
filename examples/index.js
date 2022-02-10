/**
 * Create Mock Data
 */
 let data = [];

 function generateItemsForParent(parentObj, level) {
     for (let i = 0; i < parentObj.children/2; i++) {         
         let obj = {
             id: data.length,
             label: parentObj.label + "." + i,
             parent: parentObj.id,
             children: (level !== 3? 5 : 0)*2,
             offset: i*2
         };
         data.push(obj);
         let obj2 = {
             id: data.length,
             label: parentObj.label + "." + i + " no child",
             parent: parentObj.id,
             children: 0,
             offset: i*2+1
         };
         data.push(obj2);
         if (obj.children) {
             generateItemsForParent(obj, level + 1);
         }
     }
 };
 
 generateItemsForParent({
     id: null,
     label: "Item ",
     children: 5
 }, 0);

// Helper function for demo to dynamically expand items
function findItemInDataForExpansion (label) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].label === label) {
            return data[i];
        }
    }
}

/**
 * Called by the VST to get data.
 *
 * @method onDataFetch
 */
function onDataFetch(queries, resolve) {
    let output = [];

    queries.forEach(function(query) {
        let filteredItems = data.filter(function(obj) {
            return obj.parent === query.parent;
        });

        output.push({
            parent: query.parent,
            items: filteredItems.splice(query.offset, isNaN( query.limit)? filteredItems.length : query.limit)
        });

    });

    resolve(JSON.parse(JSON.stringify(output)));
}

function onItemRender (element, item) {
    element.innerHTML  = 
	'<div class="Item"> <span style="padding-left: '+ (item.indent * 30) + 'px">'
			+ (item.children? (item.expanded? '-' : '+') : String.fromCharCode(160)) + ' ' + item.label
			+ '</span></div>';
            element.children[0].onclick = () => {item.toggle()}};


let mainelement = document.getElementById("tree");
let control = new VirtualScrollingTree(
{
	parent:mainelement,
	itemHeight:18,
	onDataFetch:onDataFetch,
	onItemRender:onItemRender,
    smoothScrolling: true,
    totalRootItems:  data.filter(function(obj) {
        return obj.parent === null;
    }).length
} );



function expandtest() {
	ids = [];
	id = findItemInDataForExpansion("Item .4.0.3.0").id;
	while(id !== null) {
		ids.push(id);
		id = data[id].parent;
	}
	ids = ids.reverse();
	ids.forEach( x=> control.expand(data[x]) );
}