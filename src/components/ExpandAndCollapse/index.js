import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

import "./index.css";

const initialNodes = [
  {
    id: "1",
    name: "Streams",
    children: [
      {
        id: "2",
        name: "Science",
        parent: "1",
        children: [
          {
            id: "3",
            name: "PCMB",
            parent: "2",
            children: [],
          },
          {
            id: "4",
            name: "PCMC",
            parent: "2",
            children: [],
          },
          {
            id: "5",
            name: "PCME",
            parent: "2",
            children: [],
          },
        ],
      },
      {
        id: "6",
        name: "Commerce",
        parent: "1",
        children: [
          {
            id: "7",
            name: "BBA",
            parent: "6",
            children: [
              {
                id: "8",
                parent: "7",
                name: "BBA HR",
                children: [],
              },
              {
                id: "9",
                parent: "7",
                name: "BBA Marketing",
                children: [],
              },
              {
                id: "10",
                parent: "7",
                name: "BBA Finance",
                children: [],
              },
              {
                id: "11",
                parent: "7",
                name: "BBA International Business",
                children: [],
              },
            ],
          },
          {
            id: "12",
            name: "BCom",
            parent: "6",
            children: [],
          },
        ],
      },
      {
        id: "13",
        name: "Arts",
        parent: "1",
        children: [
          {
            id: "14",
            name: "History",
            parent: "13",
            children: [
              {
                id: "15",
                parent: "14",
                name: "Ancient History",
                children: [],
              },
              {
                id: "16",
                parent: "14",
                name: "Modern History",
                children: [],
              },
            ],
          },
          {
            id: "17",
            name: "Political Science",
            parent: "13",
            children: [
              {
                id: "18",
                parent: "17",
                name: "International Relations",
                children: [],
              },
              {
                id: "19",
                parent: "17",
                name: "Political Theory",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

const initialEdges = [
  {
    id: "edges-e5-7",
    source: "0",
    target: "1",
    label: "+",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFCC00", color: "#fff", fillOpacity: 0.7 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 1,
};

const ExpandAndCollapse = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [fetchedDataCache, setFetchedDataCache] = useState({});
  const [nodesWithAddedData, setNodesWithAddedData] = useState(new Set());
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const initialNodesFormatted = initialNodes.map((item) => ({
      id: item.id,
      type: item?.children?.length ? "default" : "output",
      data: {
        label: item.name,
        children: item.children,
        parent: item.parent,
        isVisible: true,
      },
      position: { x: 0, y: 250 },
      sourcePosition: "right",
      targetPosition: "left",
    }));
    setNodes(initialNodesFormatted);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const fetchSubjectData = async () => {
    try {
      const response = await fetch(
        `https://test.elcarreira.com/careerpath/getIndustryRoleInfo?course=BBA`
      );
      const data = await response.json();
      const uniqueIndustries = data.jobs.reduce((acc, job) => {
        if (!acc.some((industry) => industry.id === job.industry)) {
          acc.push({
            id: job.industry,
            label: job.industry,
            children: [],
          });
        }
        return acc;
      }, []);
      console.log(uniqueIndustries);
      return transformApiData(uniqueIndustries);
    } catch (error) {
      console.error("Error fetching subject data:", error);
      return null;
    }
  };

  const transformApiData = (apiData) => {
    return apiData.map((job) => ({
      id: uuidv4(),
      type: "default",
      data: {
        label: job.label,
        children: job.children || [],
      },
      position: { x: 0, y: 0 },
    }));
  };

  const getAllDescendantIds = (nodeId) => {
    const ids = [];
    const findChildren = (id) => {
      const children = nodes.filter((item) => item?.data?.parent === id);
      children.forEach((child) => {
        ids.push(child.id);
        findChildren(child.id);
      });
    };
    findChildren(nodeId);
    return ids;
  };

  const calculateSpacing = (siblingsCount) => {
    if (siblingsCount <= 1) return [0];
    const spacing = [];
    const totalSpacing = (siblingsCount - 1) * 60;
    const startY = -(totalSpacing / 2);
    for (let i = 0; i < siblingsCount; i++) {
      spacing.push(startY + i * 60);
    }
    return spacing;
  };

  

  // Add this effect to log nodes when they change
    console.log("Current nodes:", nodes);
    console.log("Current edges:", edges);
  }, [nodes, edges]);

  console.log(
    "Nodes to render:",
    nodes.filter((node) => node.data.isVisible)
  );
  console.log("Edges to render:", edges);

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes.filter((node) => node.data.isVisible)}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        maxZoom={0.9}
        defaultViewport={{ x: 1, y: 1, zoom: 0.5 }}
        fitViewOptions={fitViewOptions}
        key={updateTrigger}
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <ExpandAndCollapse />
  </ReactFlowProvider>
);
