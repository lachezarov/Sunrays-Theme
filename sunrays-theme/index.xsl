<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="utf-8" doctype-public="" doctype-system="" />
	<xsl:template match="/html/body">

		<html>
			<head>
				<meta name="viewport" content="width=device-width" />
				<title><xsl:value-of select="request_uri" /></title>
				
				<link rel="stylesheet" href="/sunrays-theme/theme.css" />

				<script type="text/javascript">
					autoDrillDown = <xsl:value-of select="auto_drill_down" />;
					searchEnabled = <xsl:value-of select="search" />;
					themeDir = <xsl:value-of select="theme_dir" />;
				</script>
			</head>

			<body>
				<xsl:attribute name="class">
					<xsl:value-of select="theme" />
				</xsl:attribute>

				<div class="wrapper">
					<header class="header">
						<div class="shell">
							<a href="/" class="logo logo-company">
								<img src="/sunrays-theme/logo.svg" alt="" />
							</a>
							
							<nav class="nav-sort">
								<div class="nav-trigger"></div>

								<xsl:apply-templates select="table/tr[th]" />
							</nav>
						</div>
					</header>

					<main class="main">
						<div class="shell">
							<div class="items">
								<xsl:apply-templates select="table/tr[td]" />
							</div>
						</div>
					</main>
				</div>

				<script src="/sunrays-theme/theme.js"></script>
			</body>
	  </html>
	</xsl:template>

	<xsl:template match="tr[th]">
		<xsl:variable name="SortType" select="../../sort/type" />
		<xsl:variable name="SortDirection" select="../../sort/direction" />

		<ul class="dropdown">
			<xsl:choose>
				<xsl:when test="not(string($SortType))">
					<li class="active ascending"><xsl:copy-of select="th[position()=2]/a" /></li>
				</xsl:when>

				<xsl:when test="$SortType = 'N'">
					<xsl:choose>
						<xsl:when test="$SortDirection = 'A'">
							<li class="active ascending"><xsl:copy-of select="th[position()=2]/a" /></li>
						</xsl:when>

						<xsl:otherwise>
							<li class="active descending"><xsl:copy-of select="th[position()=2]/a" /></li>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>

				<xsl:otherwise>
					<li><xsl:copy-of select="th[position()=2]/a" /></li>
				</xsl:otherwise>
			</xsl:choose>

			<xsl:choose>
				<xsl:when test="$SortType = 'M'">
					<xsl:choose>
						<xsl:when test="$SortDirection = 'A'">
							<li class="active ascending"><xsl:copy-of select="th[position()=3]/a" /></li>
						</xsl:when>

						<xsl:otherwise>
							<li class="active descending"><xsl:copy-of select="th[position()=3]/a" /></li>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>

				<xsl:otherwise>
					<li><xsl:copy-of select="th[position()=3]/a" /></li>
				</xsl:otherwise>
			</xsl:choose>

			<xsl:choose>
				<xsl:when test="$SortType = 'S'">
					<xsl:choose>
						<xsl:when test="$SortDirection = 'A'">
							<li class="active ascending"><xsl:copy-of select="th[position()=4]/a" /></li>
						</xsl:when>

						<xsl:otherwise>
							<li class="active descending"><xsl:copy-of select="th[position()=4]/a" /></li>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>

				<xsl:otherwise>
					<li><xsl:copy-of select="th[position()=4]/a" /></li>
				</xsl:otherwise>
			</xsl:choose>
		</ul>
	</xsl:template>

	<xsl:template match="tr[td]">
		<xsl:variable name="ItemSize" select="td[position()=4]" />
		<xsl:variable name="ItemModified" select="td[position()=3]" />
		<xsl:variable name="ItemHref" select="td[position()=2]/a/@href" />

		<a class="item">
			<xsl:attribute name="href">
				<xsl:value-of select="$ItemHref" />
			</xsl:attribute>

			<div class="item-icon"><xsl:copy-of select="td[position()=1]/*" /></div>

			<div class="item-name">
				<xsl:value-of select="td[position()=2]/a" />
			</div>

			<xsl:choose>
				<xsl:when test="normalize-space($ItemSize) != '-'">
					<small class="item-size"><xsl:value-of select="td[position()=4]" /></small>
				</xsl:when>
			</xsl:choose>
			
			<xsl:choose>
				<xsl:when test="string-length($ItemModified) > 1">
					<div class="item-modified"><xsl:value-of select="$ItemModified" /></div>
				</xsl:when>
			</xsl:choose>
		</a>
	</xsl:template>
</xsl:stylesheet>