import tiktoken


def _get_encoding(model: str):
    try:
        return tiktoken.encoding_for_model(model)
    except KeyError:
        return tiktoken.get_encoding("cl100k_base")


def chunk_segments(
    segments: list[dict], chunk_size_tokens: int, overlap_tokens: int, model: str
) -> list[dict]:
    encoding = _get_encoding(model)
    token_counts = [len(encoding.encode(seg["text"])) for seg in segments]

    chunks = []
    start_idx = 0
    n = len(segments)
    chunk_index = 0

    while start_idx < n:
        end_idx = start_idx
        total = 0
        while end_idx < n and total + token_counts[end_idx] <= chunk_size_tokens:
            total += token_counts[end_idx]
            end_idx += 1
        if end_idx == start_idx:
            end_idx = start_idx + 1

        chunk_segs = segments[start_idx:end_idx]
        chunks.append(
            {
                "chunk_index": chunk_index,
                "text": " ".join(s["text"] for s in chunk_segs),
                "start_time": chunk_segs[0]["start"],
            }
        )
        chunk_index += 1

        if end_idx >= n:
            break

        overlap_total = 0
        back_idx = end_idx
        while back_idx > start_idx and overlap_total < overlap_tokens:
            back_idx -= 1
            overlap_total += token_counts[back_idx]
        start_idx = back_idx if back_idx > start_idx else end_idx

    return chunks
