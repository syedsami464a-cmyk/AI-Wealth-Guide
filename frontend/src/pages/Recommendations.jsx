import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
function RecommendationsPage() {
    return (<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Recommendations & Comparison</h1>
        <p className="mt-2 text-muted-foreground">Explore each product's risk, returns, liquidity, and tax benefits.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (<motion.div key={p.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }} whileHover={{ y: -4 }}>
            <Link to={`/products/${p.id}`} className="block rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-6 w-6"/>
              </div>
              <div>
                <div className="font-semibold text-lg hover:text-primary transition-colors">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <MetaBox label="Returns" value={p.expectedReturns} accent/>
              <MetaBox label="Risk" value={p.risk}/>
              <MetaBox label="Liquidity" value={p.liquidity}/>
              <MetaBox label="Lock-in" value={p.lockIn}/>
            </div>
            </Link>
          </motion.div>))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Full Comparison</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Returns</TableHead>
                <TableHead>Liquidity</TableHead>
                <TableHead>Tax Benefits</TableHead>
                <TableHead>Lock-in</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (<TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <Link to={`/products/${p.id}`} className="flex items-center gap-2 hover:text-primary">
                      <p.icon className="h-4 w-4 text-primary"/> {p.name}
                    </Link>
                  </TableCell>
                  <TableCell>{p.risk}</TableCell>
                  <TableCell className="text-secondary font-semibold">{p.expectedReturns}</TableCell>
                  <TableCell>{p.liquidity}</TableCell>
                  <TableCell>{p.taxBenefit}</TableCell>
                  <TableCell>{p.lockIn}</TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>);
}
function MetaBox({ label, value, accent }) {
    return (<div className="rounded-lg bg-muted p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`font-semibold ${accent ? "text-secondary" : ""}`}>{value}</div>
    </div>);
}

export default RecommendationsPage;
