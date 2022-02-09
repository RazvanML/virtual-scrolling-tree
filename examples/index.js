/**
 * Create Mock Data
 */
let data = [];
let id = 0;
let totalRootItems = 5;

function generateItemsForParent(parentObj, level) {
    for (let i = 0; i < parentObj.children; i++) {
        let obj = {
            id: id++,
            label: parentObj.label + "." + i,
            parent: parentObj.id,
            children: level !== 3? 5 : 0
        };
        data.push(obj);
        let obj2 = {
            id: id++,
            label: parentObj.label + "." + i + " no child",
            parent: parentObj.id,
            children: 0
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
    children: totalRootItems
}, 0);

// Helper function for demo to dynamically expand items
function findItemInDataForExpansion (label) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].label === label) {
            let item = data[i];
            let offset = data.filter(d => d.parent === item.parent).findIndex(d => d.id === item.id);

            return {
                parent: item.parent,
                id: item.id,
                children: item.children,
                offset: offset
            };
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

