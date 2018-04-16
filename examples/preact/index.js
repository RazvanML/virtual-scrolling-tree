window.React = window.preact;

/**
 * Create Mock Data
 */
let data = [];
let id = 0;
let totalRootItems = 5;

let generateItemsForParent = function(parentObj, level) {
    for (let i = 0; i < parentObj.children; i++) {
        let obj = {
            id: id++,
            label: parentObj.label + "." + i,
            parent: parentObj.id,
            children: level !== 3? 5 : 0
        };
        data.push(obj);

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


/**
 * Called by the VST to get data.
 *
 * @method onDataFetch
 */
function onDataFetch(query, resolve) {
    let output = [];

    query.forEach(function(query) {
        let filteredItems = data.filter(function(obj) {
            return obj.parent === query.parent;
        });

        output.push({
            parent: query.parent,
            items: filteredItems.splice(query.offset, query.limit)
        });

    });

    resolve(JSON.parse(JSON.stringify(output)));
}

/**
 * React wrapper implement for the VST widget.
 *
 * @class ReactVirtualScrollingTree
 */
class ReactVirtualScrollingTree extends React.Component {
    constructor () {
        super();
    }

    componentDidMount () {
        let { 
            itemHeight, 
            onDataFetch, 
            onItemRender,
            totalRootItems 
        } = this.props;

        let render = (parent, item) => {
            return React.render(onItemRender(item), parent);
        }

        this.instance = new VirtualScrollingTree({
            parent: this.base,
            totalRootItems: totalRootItems,
            itemHeight: itemHeight,
            onItemRender: render,
            onDataFetch: onDataFetch
        });
    }

    render () {
        return (<div style="height: 400px"/>);
    }
}

/**
 * App using the ReactVirtualScrollingTree
 *
 * @class App
 */
class App extends React.Component {
    constructor () {
        super();
    }

    render () {
        let ItemStyles = `
            height: 32px;
            border-bottom: 1px solid black;
            box-sizing: border-box;
            font-size: 16px;
            vertical-align: middle;
            line-height: 32px;
        `;

        return (
            <div>
                <h1>Simple Example</h1>
                <ReactVirtualScrollingTree
                    totalRootItems={totalRootItems}
                    itemHeight={32}
                    onDataFetch={onDataFetch}
                    onItemRender={item => {
                        return (
                            <div class="Item" style={ItemStyles} onClick={item.toggle}>
                                <span style={`padding-left: ${item.indent * 30}px`}>
                                    {
                                        (item.data.children? (item.expanded? '-' : '+') : '') + ' ' + item.data.label
                                    }
                                </span>
                            </div>
                        );
                    }}
                />
            </div>
        );
    }
}

React.render(<App />, document.querySelector('#root'));