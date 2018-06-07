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
        this.createInstance(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.createInstance(nextProps);
    }

    createInstance (props) {
        if (this.instance) {
            this.instance.destroy();
        }

        let { onItemRender } = props;

        let render = (parent, item, updating) => {
            return React.render(onItemRender(item), parent, updating? parent.firstChild : undefined);
        }

        this.instance = new VirtualScrollingTree({
            ...props,
            parent: this.base,
            onItemRender: render,
        });
    }

    render () {
        return (<div style="height: 300px"/>);
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

        this.state = {
            demo: 0
        }
    }

    showDemo (index) {
        this.setState({ demo: index });
    }

    render () {
        let ItemStyles = `
            height: 32px;
            border-bottom: 1px solid black;
            box-sizing: border-box;
            font-size: 16px;
            vertical-align: middle;
            line-height: 32px;
            cursor: pointer;
        `;

        function onItemRender (item) {
            return (
                <div class="Item" style={ItemStyles} onClick={item.toggle}>
                    <span style={`padding-left: ${item.indent * 30}px`}>
                        {
                            (item.children? (item.expanded? '-' : '+') : '') + ' ' + item.label
                        }
                    </span>
                </div>
            );
        }

        function onItemRenderComplex (item) {
            let ItemStyles = `
                height: 32px;
                box-sizing: border-box;
                font-size: 16px;
                vertical-align: middle;
                line-height: 32px;
                cursor: pointer;
            `;

            let ColumnStyle = `
                padding: 0 10px;
                box-sizing: border-box;
                min-width: 300px;
                max-width: 300px;
            `;

            return (
                <div class="Item" style={ItemStyles} onClick={item.toggle}>
                    <div style={`display: flex; padding-left: ${item.indent * 30}px;`}>
                        <div>
                            {
                                (item.children? (item.expanded? '-' : '+') : '')
                            }
                        </div>
                        <div style={ColumnStyle}>
                            {item.label}
                        </div>
                        <div style={ColumnStyle}>
                            {item.label}
                        </div>
                        <div style={ColumnStyle}>
                            {item.label}
                        </div>
                        <div style={ColumnStyle}>
                            {item.label}
                        </div>
                        <div style={ColumnStyle}>
                            {item.label}
                        </div>
                        <div style={ColumnStyle}>
                            {item.label}
                        </div>
                    </div>
                </div>
            );
        }

        let demos = [{
            title: 'Simple',
            body: (
                <div>
                    <p>Simple tree where rows shift as you scroll.</p>
                    <ReactVirtualScrollingTree
                        totalRootItems={totalRootItems}
                        itemHeight={32}
                        onDataFetch={onDataFetch}
                        onItemRender={onItemRender}
                    />
                </div>
            )
        }, {
            title: 'Smooth Scrolling', 
            body: (
                <div>
                    <p>Smooth scrolling instead of row shifting.</p>
                    <ReactVirtualScrollingTree
                        totalRootItems={totalRootItems}
                        itemHeight={32}
                        onDataFetch={onDataFetch}
                        onItemRender={onItemRender}
                        smoothScrolling={true}
                    />
                </div>
            )
        }, {
            title: 'Soft Updates',
            body: (
                <div>
                    <p>
                        Instead of destroying all rows and re-creating them,
                        this will check for elements that are updating. This
                        works best when using a virtual DOM library to 
                        manage the updating. See developer tools.
                    </p>
                    <ReactVirtualScrollingTree
                        totalRootItems={totalRootItems}
                        itemHeight={32}
                        onDataFetch={onDataFetch}
                        onItemRender={onItemRender}
                        smoothScrolling={true}
                        diffMode="soft"
                    />
                </div>
            )
        }, {
            title: 'Soft Update Horizontal',
            body: (
                <div>
                    <p>
                        Horizontal scrolling example with soft updates and smooth scrolling enabled.
                    </p>
                    <ReactVirtualScrollingTree
                        totalRootItems={totalRootItems}
                        itemHeight={32}
                        onDataFetch={onDataFetch}
                        onItemRender={onItemRenderComplex}
                        smoothScrolling={true}
                        diffMode="soft"
                    />
                </div>
            )
        }];

        return (
            <div>
                {demos.map((demo, index) => (
                    <div 
                        style={`
                            display: inline-block;
                            margin: 0 20px 20px 0;
                            padding: 4px 10px;
                            cursor: pointer;
                            ${index === this.state.demo? 'border-bottom: 1px solid black' : ''}
                        `}
                        onClick={() => this.showDemo(index)}
                    >
                        {demo.title}
                    </div>
                ))}
                {demos[this.state.demo].body}
            </div>
        );
    }
}

React.render(<App />, document.querySelector('#root'));