[Polymer](http://www.polymer-project.org/) web component that implements a real time blog/cms for a [Racer](https://github.com/codeparty/racer) backend.

It is an experiment in software architecture using web components, but is intended to be usable as I plan to implement my personal blog on it in the near future.
This component in itself has little logic, and relies on the following sub-components, each designed to be standalone, thus the separate repositories:

- [smart-post](http://github.com/jpka/smart-post)
- [smart-list](http://github.com/jpka/smart-list)
- [racer-element](http://github.com/jpka/racer-element)
- [racer-list](http://github.com/jpka/racer-list)

## Installation

```
bower install racer-blog
```

## Example usage

Take a look at example/ folder. 
To run it you need to clone this repo, then run a mongo server making sure that the mongoskin string in example/server.js corresponds to it.

Afterwards, just

```
bower install
npm install
node example/server.js
```

and point your browser to http://localhost:3000.

Note:
  - Polymer runs on pretty much every browser, but only on latest versions.
  - Racer needs redis server >=2.6 running to work.
