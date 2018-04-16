# Virtual Scrolling Tree

Virtual scrolling tables are an easy problem to solve. If you know how many rows there are in a table, you can easily map the scrollbar position to a row index and slice the data of the table to show that index. For trees however, it's a significantly more complicated problem. With trees, you have items that can expand and change the total scroll height, and the parent for an item that isn't necessarily visible or in the DOM as you're scrolling. 

This project demonstrates how to implement a tree which adopts the virtual scrolling technique.

## Getting Started

Install the package. The package provides many different formats depending on your tool setup.

```
npm install virtual-scrolling-tree
```

Assuming you're using ES6, you can then import the package.

```
import VirtualScrollingTree from 'virtual-scrolling-tree';
```

## Running Examples

Examples are stored in the ```examples``` folder. To run them run:

```
npm start
```

And then visit the following:

```
http://localhost:8585/examples/preact/index.html
```

## Constructor Options

* ***[HTMLElement]* parent:** The element to instantiate this component into.
* ***[Number]* totalRootItems:** The starting number of items must be known.
* ***[Number]* itemHeight:** Pixel size of each item in the tree. Must always be the same.
* ***[Function]* onItemRender:** Called for each item. Passes the target element and metadata about the item it's rendering.
* ***[Function]* onDataFetch:** Called when there's a need for data.
* ***[String]* scrollbarClass:** Optional scrollbar CSS class if you have a custom scrollbar.
* ***[Boolean]* smoothScrolling:** Optional, if enabled, smoothly scrolls to look more native instead of shifting rows. Might not be suitable when using asynchronous onDataFetch.

## onItemRender

The following properties are passed into the onItemRender callback:

* ***[Object]* data:** Contains the object that was given by onDataFetch.
* ***[Boolean]* expanded:** If true, the item is in an expanded state.
* ***[Number]* indent:** Represents how indented this item should be.
* ***[Function]* toggle:** Call this function to expand/collapse the item.

```
onItemRender: (element, item) => {
    element.innerHTML = `
        <div class="Item">
            <div style="padding-left: ${item.indent * 20}px" />
            <div>{item.data.children? (item.expanded? '-' : '+') : ''}</div>
            <div>{item.data.label}</div>
        </div>
    `;

    element.children[0].addEventListener('click', item.toggle);
}
```

## onDataFetch

Provides a query array with multiple requests to be fulfilled, and a resolve function.
This function can operate asynchronously if it wants to. 
If resolve is called immediately it's synchronous.

### Example

```
onDataFetch: (query, resolve) {
    resolve(getData(query));
}
```

### Query Objects

Query objects contain the following:

* ***[String|Null]* parent:** Contains the id of the parent. If it's the root, the value will be null.
* ***[Number]* offset:** When fetching the children for this parent, start from this offset rather than the beginning.
* ***[Number]* limit:** Fetch this amount of children from the offset.

```
{
    "parent": "123",
    "offset": 5,
    "limit": 10
}
```

### Query Responses

Query responses must be given in the form of an array, and must match the same order as the query objects. The following are the expected properties for query responses:

* ***[String|Null]* parent:** The parent id, if it's the root, the parent is null.
* ***[Array]* items:** Array of items.

Items must have the following properties:

* ***[String]* id:** The id of the item. This will be used to reference the item by the component.
* ***[String]* label:** Public display for the label.
* ***[Number]* children:** The amount of children this item has. When an item is toggled it will use this number to determine how many to fetch.


## Methods 

**redraw:** Redraw the component. If layout is changing without the resizing of the window, you'll need to call this function.

**destroy:** Clean up the component.

## Demo

[Old Live Demo](http://pepsryuu.github.io/demo/vst/)