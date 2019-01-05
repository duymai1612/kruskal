var edgeList = [];
  const tbody = document.getElementById('table-body');
  const addBtn = document.getElementById('add-btn');
  const createBtn = document.getElementById('create-btn');
  const submit = document.getElementById('submit');
  const nodeNum = document.getElementById('nodes-num');
  const node1 = document.getElementById('node-1');
  const node2 = document.getElementById('node-2');
  const weight = document.getElementById('weight');
  
  function updateTable() {
    edgeList.push({
      node1: node1.value,
      node2: node2.value,
      weight: weight.value
    });
    
    tbody.innerHTML = edgeList.map((edge, index) => `
      <tr>
        <th scope="row">${index}</th>
        <td>${edge.node1}</td>
        <td>${edge.node2}</td>
        <td>${edge.weight}</td>
      </tr>
    `);
  }

  (function(){

    var g, gFinal;
    nodeNum.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        g = new jsgraphs.WeightedGraph(nodeNum.value);
        alert(`Create graph with ${nodeNum.value} nodes successfully`);
      }
    })
    createBtn.addEventListener('click', () => {
      g = new jsgraphs.WeightedGraph(nodeNum.value);
      alert(`Create graph with ${nodeNum.value} nodes successfully`);
    });

    weight.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        g.addEdge(new jsgraphs.Edge(node1.value, node2.value, weight.value));
        updateTable();
      }
    })
    addBtn.addEventListener('click', () => {
      g.addEdge(new jsgraphs.Edge(node1.value, node2.value, weight.value));
      updateTable();
    });

    submit.addEventListener('click', function() {
      gFinal = g;
      var kruskal = new jsgraphs.KruskalMST(g); 
      var mst = kruskal.mst;
      

      var g_nodes = [];
      var g_edges = [];
      for (var v=0; v < g.V; ++v){
        g.node(v).label = v; // assigned 'Node {v}' as label for node v
        g_nodes.push({
            id: v,
            label: g.node(v).label
        });
      }
      
      for (var i=0; i < mst.length; ++i) {
        var e = mst[i];
        var v = e.either();
        var w = e.other(v);
        e.highlighted = true;
        console.log('(' + v + ', ' + w + '): ' + e.weight);
        g_edges.push({
            from: v,
            to: w,
            length: e.weight,
            label: '' + e.weight,
            color: '#ff0000',
            value: 2
        });
      }
      
      for (var v = 0; v < g.V; ++v) {
        var adj_v = g.adj(v);
        for (var i = 0; i < adj_v.length; ++i) {
            var e = adj_v[i];
            var w = e.other(v);
            if (w > v) continue; // make sure only one edge between w and v since the graph is undirected
            if (e.highlighted) continue;

            g_edges.push({
                from: v,
                to: w,
                length: e.weight,
                label: '' + e.weight
            });
        };
      }

      console.log(g.V); // display the number of vertices
      console.log(g.adj(0)); // display the adjacency list to vertex 0
      
      var nodes = new vis.DataSet(g_nodes);

      // create an array with edges
      var edges = new vis.DataSet(g_edges);

      // create a network
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {};
      var network = new vis.Network(container, data, options);
    })

  })();