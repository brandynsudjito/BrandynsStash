// src/firebase/itemService.js
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const itemsCollection = collection(db, "figures");

// Fetch all items with filtering and sorting
export const getItems = async (searchTerm = "", searchType = "all", sortKey = "", sortDirection = "ascending") => {
  try {
    console.log(query(itemsCollection));
    // Start with a base query
    let q = query(itemsCollection);
    
    // Apply search filter if a search term is provided
    if (searchTerm) {
      if (searchType === "name") {
        // Search by name
        const searchTermLower = searchTerm.toLowerCase();
        const searchTermUpper = searchTerm.toLowerCase() + '\uf8ff';
        q = query(
          itemsCollection,
          where("nameLower", ">=", searchTermLower),
          where("nameLower", "<=", searchTermUpper)
        );
      } else if (searchType === "series") {
        // Search by series
        q = query(
          itemsCollection,
          where("seriesLower", "array-contains-any", [searchTerm.toLowerCase()])
        );
      }
      // For "all", we'll need to combine results after fetching
    }
    
    // Apply sorting if provided
    if (sortKey) {
      const sortField = sortKey === "series" ? "seriesFirst" : sortKey;
      q = query(q, orderBy(sortField, sortDirection === "ascending" ? "asc" : "desc"));
    }
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Extract the data
    let items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // If searching "all", we need to filter client-side
    if (searchTerm && searchType === "all") {
      const searchTermLower = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTermLower) || 
        (Array.isArray(item.series) && 
          item.series.some(series => series.toLowerCase().includes(searchTermLower)))
      );
    }
    
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

// Get a single item by ID
export const getItemById = async (id) => {
  try {
    const docRef = doc(db, "figures", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such item!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};