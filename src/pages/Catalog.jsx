import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Drawer from "@mui/material/Drawer";
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Inbox as InboxIcon
} from "@mui/icons-material";

import { Container } from "../components/primitives/Container";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { Chip } from "../components/primitives/Chip";
import { Skeleton } from "../components/primitives/Skeleton";
import { EmptyState } from "../components/primitives/EmptyState";
import { Rating } from "../components/primitives/Rating";
import { ProductCard } from "../features/products/components/ProductCard/ProductCard";
import { productService } from "../services/productService";
import { useCart } from "../store/CartContext";
import { useWishlist } from "../store/WishlistContext";

const CatalogLayout = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  gap: theme.spacing(8),
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(16),

  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "1fr",
  },
}));

const SidebarContainer = styled("aside")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(6),

  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const FilterGroup = styled("div")(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.border.default}`,
  paddingBottom: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const FilterTitle = styled("h4")(({ theme }) => ({
  margin: 0,
  fontSize: "14px",
  fontWeight: theme.typography.weight.bold,
  color: theme.palette.text.primary,
}));

const SortAndFilterHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(6),
  gap: theme.spacing(4),

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

export const Catalog = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Extract initial query coordinates
  const getInitialParam = (key, fallback) => searchParams.get(key) || fallback;

  // Sync state parameters from URL initializations
  const [localSearch, setLocalSearch] = useState(() => getInitialParam("search", ""));
  const [search, setSearch] = useState(() => getInitialParam("search", ""));
  const [category, setCategory] = useState(() => getInitialParam("category", "All"));
  const [type, setType] = useState(() => getInitialParam("type", "ALL"));
  const [minRating, setMinRating] = useState(() => parseInt(getInitialParam("minRating", "0"), 10));
  const [inStockOnly, setInStockOnly] = useState(() => getInitialParam("inStockOnly", "false") === "true");
  const [sortBy, setSortBy] = useState(() => getInitialParam("sortBy", "trending"));
  
  const [priceRange, setPriceRange] = useState(() => {
    const min = parseInt(getInitialParam("minPrice", "0"), 10);
    const max = parseInt(getInitialParam("maxPrice", "300"), 10);
    return [min, max];
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Synchronize state changes back to URL search params
  useEffect(() => {
    const nextParams = {};
    if (search) nextParams.search = search;
    if (category && category !== "All") nextParams.category = category;
    if (type && type !== "ALL") nextParams.type = type;
    if (priceRange[0] > 0) nextParams.minPrice = priceRange[0].toString();
    if (priceRange[1] < 300) nextParams.maxPrice = priceRange[1].toString();
    if (minRating > 0) nextParams.minRating = minRating.toString();
    if (inStockOnly) nextParams.inStockOnly = "true";
    if (sortBy && sortBy !== "trending") nextParams.sortBy = sortBy;

    setSearchParams(nextParams);
  }, [search, category, type, priceRange, minRating, inStockOnly, sortBy, setSearchParams]);

  // Synchronize local states when searchParams change externally (e.g., header search or footer categories click)
  useEffect(() => {
    const uSearch = searchParams.get("search") || "";
    const uCategory = searchParams.get("category") || "All";
    const uType = searchParams.get("type") || "ALL";
    const uMinPrice = parseInt(searchParams.get("minPrice") || "0", 10);
    const uMaxPrice = parseInt(searchParams.get("maxPrice") || "300", 10);
    const uMinRating = parseInt(searchParams.get("minRating") || "0", 10);
    const uInStock = searchParams.get("inStockOnly") === "true";
    const uSort = searchParams.get("sortBy") || "trending";

    if (uSearch !== localSearch) setLocalSearch(uSearch);
    if (uSearch !== search) setSearch(uSearch);
    if (uCategory !== category) setCategory(uCategory);
    if (uType !== type) setType(uType);
    if (uMinRating !== minRating) setMinRating(uMinRating);
    if (uInStock !== inStockOnly) setInStockOnly(uInStock);
    if (uSort !== sortBy) setSortBy(uSort);
    if (uMinPrice !== priceRange[0] || uMaxPrice !== priceRange[1]) {
      setPriceRange([uMinPrice, uMaxPrice]);
    }
  }, [searchParams, localSearch, search, category, type, minRating, inStockOnly, sortBy, priceRange]);

  // Query catalog API endpoints
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const list = await productService.getProducts({
          search,
          category,
          type: type === "ALL" ? "" : type,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          inStockOnly,
          sortBy,
        });
        setProducts(list);

        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load catalog products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [search, category, type, priceRange, minRating, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setLocalSearch("");
    setSearch("");
    setCategory("All");
    setType("ALL");
    setPriceRange([0, 300]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("trending");
    setSearchParams({});
  };

  const hasActiveFilters = 
    search || 
    category !== "All" || 
    type !== "ALL" || 
    priceRange[0] > 0 || 
    priceRange[1] < 300 || 
    minRating > 0 || 
    inStockOnly;

  const renderFilters = () => (
    <>
      <FilterGroup>
        <FilterTitle>Product Type</FilterTitle>
        <Box display="flex" flexDirection="column" gap={1}>
          {[
            { label: "All Items", value: "ALL" },
            { label: "Digital Goods", value: "DIGITAL" },
            { label: "Physical Gear", value: "PHYSICAL" },
          ].map((opt) => (
            <FormControlLabel
              key={opt.value}
              control={
                <Checkbox
                  checked={type === opt.value}
                  onChange={() => setType(opt.value)}
                />
              }
              label={opt.label}
              style={{ fontSize: "14px" }}
            />
          ))}
        </Box>
      </FilterGroup>

      <FilterGroup>
        <FilterTitle>Categories</FilterTitle>
        <Box display="flex" flexDirection="column" gap={1}>
          {categories.map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
              }
              label={cat}
            />
          ))}
        </Box>
      </FilterGroup>

      <FilterGroup>
        <FilterTitle>Price Threshold</FilterTitle>
        <Box px={2}>
          <Slider
            value={priceRange}
            onChange={(_e, val) => setPriceRange(val)}
            valueLabelDisplay="auto"
            min={0}
            max={300}
            sx={{
              color: theme.palette.primary.main,
              "& .MuiSlider-thumb": {
                borderRadius: "4px"
              }
            }}
          />
          <Box display="flex" justifyContent="space-between" fontSize="12px" color="text.secondary" mt={1}>
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </Box>
        </Box>
      </FilterGroup>

      <FilterGroup>
        <FilterTitle>Customer Rating</FilterTitle>
        <Box display="flex" flexDirection="column" gap={2}>
          {[4, 3, 2].map((stars) => (
            <Box
              key={stars}
              display="flex"
              alignItems="center"
              gap={2}
              style={{ cursor: "pointer" }}
              onClick={() => setMinRating(stars)}
            >
              <Checkbox checked={minRating === stars} />
              <Rating value={stars} size="xs" readOnly />
              <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>& Up</span>
            </Box>
          ))}
        </Box>
      </FilterGroup>

      <FilterGroup style={{ borderBottom: "none" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
          }
          label="In Stock Only"
        />
      </FilterGroup>

      <Button variant="secondary" onClick={handleResetFilters} fullWidth>
        Reset Filters
      </Button>
    </>
  );

  return (
    <Container maxWidth="xl" style={{ paddingTop: "48px" }}>
      <SectionHeader
        title="Workspace Catalog"
        subtitle={`Browse ${products.length} digital templates and physical desk items.`}
      />

      <SortAndFilterHeader>
        {/* Search input in catalog */}
        <Box flexGrow={1} maxWidth="400px" style={{ position: "relative" }}>
          <Input
            placeholder="Search matching items..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            fullWidth
            style={{ paddingLeft: "40px" }}
          />
          <SearchIcon
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              color: theme.palette.text.muted,
            }}
          />
        </Box>

        <Box display="flex" gap={3} alignItems="center" alignSelf={{ xs: "stretch", sm: "auto" }} justifyContent="space-between">
          <Box sx={{ display: { xs: "inline-flex", lg: "none" } }}>
            <Button
              variant="secondary"
              leftIcon={<FilterListIcon />}
              onClick={() => setMobileFilterOpen(true)}
            >
              Filters
            </Button>
          </Box>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            style={{
              borderRadius: theme.radius.md,
              backgroundColor: theme.palette.background.paper,
              fontSize: "14px",
              minWidth: "160px",
            }}
          >
            <MenuItem value="trending">Sort by: Trending</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Rating: High to Low</MenuItem>
            <MenuItem value="newest">Release: Newest</MenuItem>
          </Select>
        </Box>
      </SortAndFilterHeader>

      {/* Active Filter Chips Panel */}
      {hasActiveFilters && (
        <Box display="flex" gap={2} flexWrap="wrap" mb={6} alignItems="center">
          <span style={{ fontSize: "12px", color: theme.palette.text.secondary, marginRight: "4px" }}>
            Active Filters ({products.length} items found):
          </span>
          {search && (
            <Chip
              label={`Search: "${search}"`}
              onDelete={() => setLocalSearch("")}
            />
          )}
          {category !== "All" && (
            <Chip
              label={`Category: ${category}`}
              onDelete={() => setCategory("All")}
            />
          )}
          {type !== "ALL" && (
            <Chip
              label={`Type: ${type === "DIGITAL" ? "Digital" : "Physical"}`}
              onDelete={() => setType("ALL")}
            />
          )}
          {(priceRange[0] > 0 || priceRange[1] < 300) && (
            <Chip
              label={`Price: $${priceRange[0]}-$${priceRange[1]}`}
              onDelete={() => setPriceRange([0, 300])}
            />
          )}
          {minRating > 0 && (
            <Chip
              label={`Rating: ${minRating}+`}
              onDelete={() => setMinRating(0)}
            />
          )}
          {inStockOnly && (
            <Chip
              label="In Stock Only"
              onDelete={() => setInStockOnly(false)}
            />
          )}
          <Button 
            variant="secondary" 
            onClick={handleResetFilters} 
            size="sm" 
            style={{ minWidth: "auto", padding: "4px 8px", height: "24px", fontSize: "11px" }}
          >
            Clear All
          </Button>
        </Box>
      )}

      <CatalogLayout>
        {/* Desktop Sidebar */}
        <SidebarContainer>
          <Card padding={5} elevation="none" border={true} radius="lg">
            {renderFilters()}
          </Card>
        </SidebarContainer>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          PaperProps={{
            style: { width: "300px", padding: "24px" }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <h3>Filters</h3>
            <Button variant="secondary" onClick={() => setMobileFilterOpen(false)} style={{ minWidth: "auto", padding: "6px" }}>
              Close
            </Button>
          </Box>
          {renderFilters()}
        </Drawer>

        {/* Products Grid Section */}
        <div>
          {loading ? (
            <Grid container spacing={4}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={220} radius="lg" style={{ marginBottom: "8px" }} />
                  <Skeleton variant="text" width="70%" style={{ marginBottom: "4px" }} />
                  <Skeleton variant="text" width="30%" />
                </Grid>
              ))}
            </Grid>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<InboxIcon />}
              title="No Products Match Filters"
              description="Try adjusting your price range, clearing the search query, or checking back later."
              actionText="Reset Filters"
              onActionClick={handleResetFilters}
            />
          ) : (
            <Grid container spacing={4}>
              {products.map((prod) => (
                <Grid item xs={12} sm={6} md={4} key={prod.id}>
                  <ProductCard
                    product={prod}
                    onAddToCart={addItem}
                    onWishlistToggle={toggleWishlist}
                    isWishlisted={isWishlisted(prod.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </CatalogLayout>
    </Container>
  );
};

export default Catalog;
