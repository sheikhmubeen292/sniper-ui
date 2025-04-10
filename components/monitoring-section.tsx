export const MonitoringSection = () => {
  return (
    <>
      {/* {monitoring ? (
                      <div className="space-y-6">
                        {showTokenInfo && tokenInfo && (
                          <div className="bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                  {tokenInfo.symbol.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                                    {tokenInfo.name}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-none">
                                      {tokenInfo.symbol}
                                    </Badge>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                      Created {tokenInfo.createdAt}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-zinc-300 dark:border-zinc-800 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 transition-all duration-200"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1 text-pink-500" />
                                  Explorer
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-zinc-300 dark:border-zinc-800 hover:border-pink-500 hover:bg-pink-50/30 dark:hover:bg-pink-950/30 transition-all duration-200"
                                >
                                  <Copy className="h-3 w-3 mr-1 text-pink-500" />
                                  Copy
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Owner %
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.ownerHoldingsPercent}
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Holders
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.holders}
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Buy Tax
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.buyTax}
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-black/50 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                  Sell Tax
                                </p>
                                <p className="font-bold text-zinc-900 dark:text-white">
                                  {tokenInfo.sellTax}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <motion.div
                          className="bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="h-3 w-3 bg-pink-500 rounded-full"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "loop",
                                }}
                              />
                              <span className="font-medium">
                                Monitoring token:{" "}
                                <span className="text-pink-500 dark:text-pink-400">
                                  {address.substring(0, 6)}...
                                  {address.substring(address.length - 4)}
                                </span>
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-white/50 dark:bg-zinc-800/50 border-pink-400/30 dark:border-pink-500/30 text-pink-500 dark:text-pink-400"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                              </motion.div>
                              Live
                            </Badge>
                          </div>

                          <div className="mb-2 flex justify-between items-center">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                              Scanning for liquidity...
                            </span>
                            <span className="text-sm text-pink-500 dark:text-pink-400">
                              {progress}%
                            </span>
                          </div>
                          <div className="bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-pink-500 rounded-full"
                              style={{ width: `${progress}%` }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Flame className="h-4 w-4 text-pink-500" />
                                Liquidity Status
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">
                                  Pending
                                </span>
                                <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded-full text-xs">
                                  <AlertTriangle className="h-3 w-3" />
                                  Waiting
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-pink-500" />
                                Current Gas
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">
                                  28 Gwei
                                </span>
                                <div className="flex items-center gap-1 bg-pink-500/20 text-pink-600 dark:text-pink-500 px-2 py-1 rounded-full text-xs">
                                  <ChevronDown className="h-3 w-3" />
                                  Low
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <Percent className="h-4 w-4 text-pink-500" />
                                Estimated Buy Tax
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">
                                  Scanning...
                                </span>
                                <RefreshCw className="h-4 w-4 animate-spin text-pink-500" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
                              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-pink-500" />
                                Liquidity Detection Log
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-900/50 p-2 rounded-md">
                                  <Clock className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                                  <span className="text-pink-500 dark:text-pink-400">
                                    21:45:32
                                  </span>
                                  <span>
                                    Scanning for liquidity addition...
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-900/50 p-2 rounded-md">
                                  <Clock className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                                  <span className="text-pink-500 dark:text-pink-400">
                                    21:45:28
                                  </span>
                                  <span>
                                    Monitoring mempool for token transactions
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-900/50 p-2 rounded-md">
                                  <Clock className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                                  <span className="text-pink-500 dark:text-pink-400">
                                    21:45:15
                                  </span>
                                  <span>
                                    Started monitoring token{" "}
                                    {address.substring(0, 6)}...
                                    {address.substring(address.length - 4)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                              <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                  <BarChart3 className="h-4 w-4 text-pink-500" />
                                  Price Trend
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="py-2 px-4">
                                <div className="flex flex-col">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-bold">
                                      Analyzing
                                    </span>
                                    <div className="flex items-center gap-1 text-pink-500">
                                      <ArrowUpRight className="h-4 w-4" />
                                      <span className="text-xs">+2.5%</span>
                                    </div>
                                  </div>
                                  {renderMiniChart(chartData)}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        className="flex flex-col items-center justify-center py-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 p-6 rounded-full mb-6 shadow-lg shadow-pink-900/20"
                          animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              "0 10px 15px -3px rgba(213, 63, 140, 0.2)",
                              "0 15px 25px -5px rgba(213, 63, 140, 0.3)",
                              "0 10px 15px -3px rgba(213, 63, 140, 0.2)",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        >
                          <Target className="h-12 w-12 text-white" />
                        </motion.div>
                        <motion.h3
                          className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300 dark:from-pink-400 dark:to-pink-600"
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          No Active Monitoring
                        </motion.h3>
                        <motion.p
                          className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8"
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          Enter a token contract address and click "Start
                          Monitoring" to begin sniping
                        </motion.p>
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Button
                            className="bg-gradient-to-r from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500 hover:from-pink-400 hover:to-pink-300 dark:hover:from-pink-500 dark:hover:to-pink-400 shadow-lg shadow-pink-900/20 transition-all duration-200 px-8 py-6"
                            disabled={!connected || address.trim() === ""}
                            onClick={handleStartMonitoring}
                          >
                            <Eye className="mr-2 h-5 w-5" />
                            Start Monitoring
                          </Button>
                        </motion.div>
                      </motion.div>
                    )} */}
    </>
  );
};
