-- existing rows hold plain text; split on blank lines into one TipTap
-- paragraph per block (preserves bullet-style line breaks) rather than a
-- bare USING cast (fails on non-JSON text) or cramming everything into a
-- single paragraph (loses the line breaks). ALTER COLUMN ... USING can't
-- contain a subquery directly, so the conversion is a throwaway function.
CREATE FUNCTION pg_temp.experience_description_to_doc(input text) RETURNS jsonb AS $$
	SELECT CASE WHEN input IS NULL OR btrim(input) = '' THEN NULL ELSE jsonb_build_object(
		'type', 'doc',
		'content', (
			SELECT jsonb_agg(
				jsonb_build_object(
					'type', 'paragraph',
					'content', jsonb_build_array(
						jsonb_build_object('type', 'text', 'text', btrim(para))
					)
				)
			)
			FROM unnest(regexp_split_to_array(input, E'\n{2,}')) AS para
			WHERE btrim(para) <> ''
		)
	) END;
$$ LANGUAGE sql IMMUTABLE;
--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "description" SET DATA TYPE jsonb
	USING pg_temp.experience_description_to_doc("description");